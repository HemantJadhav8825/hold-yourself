import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentModel, IComment } from '../models/Comment';
import { ShareModel } from '../models/Share';
import { UserPreferenceModel } from '../models/UserPreference';
import { BlockService } from '../services/block.service';
import { checkRapidCommenting } from '../utils/friction';

// Serializer for comments (Local to controller for now, or move to serializer service)
const serializeComment = (comment: IComment) => ({
  id: comment._id.toString(),
  shareId: comment.shareId,
  authorId: comment.anonymous ? 'anonymous' : comment.authorId,
  content: comment.content,
  anonymous: comment.anonymous,
  createdAt: comment.createdAt.toISOString(),
});

export class CommentController {

  /**
   * POST /shares/:id/comments
   * Add a comment to a share.
   */
  async createComment(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const { content, anonymous } = req.body;
      const authorId = req.user?.sub;

      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // 1. Friction Check
      await checkRapidCommenting(authorId);

      // Check if share exists
      const share = await ShareModel.findById(shareId);
      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      if (!share.commentsEnabled) {
        return res.status(403).json({ error: 'Comments are disabled for this share' });
      }

      // 3. Block check: Cannot comment if mutual block exists
      const isBlocked = await BlockService.isBlockedMutual(authorId, share.authorId);
      if (isBlocked) {
        return res.status(403).json({ error: 'You cannot interact with this content' });
      }

      // Validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      if (content.length > 500) {
        return res.status(400).json({ error: 'Content exceeds 500 characters' });
      }

      const comment = await CommentModel.create({
        shareId,
        authorId,
        content: content.trim(),
        anonymous: !!anonymous,
      });

      res.status(201).json(serializeComment(comment));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /shares/:id/comments
   * List comments for a share.
   */
  async getComments(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const viewerId = req.user?.sub;

      // Check if share exists
      const share = await ShareModel.findById(shareId);
      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      // Check visibility of share first? 
      // Assuming if they can hit this endpoint, they likely can see the share, 
      // but strict check would be better if we had `canViewerSeeShare` imported.
      // For now, we rely on the client effectively. 
      // Ideally, we should reuse `canViewerSeeShare` logic here.

      // Load blocks
      let blockedByViewer: string[] = [];
      let blockersOfViewer: string[] = [];

      if (viewerId) {
        const [blocks, blockers] = await Promise.all([
          BlockService.getBlockedIds(viewerId),
          BlockService.getBlockersOfIds(viewerId)
        ]);
        blockedByViewer = blocks;
        blockersOfViewer = blockers;
      }

      const comments = await CommentModel.find({ shareId })
        .sort({ createdAt: 1 }); // Oldest first (chronological conversation)

      const visibleComments: IComment[] = [];

      for (const comment of comments) {
        // Shadow limiting check
        if (comment.isShadowLimited && comment.authorId !== viewerId) {
          continue;
        }

        // Block check
        if (viewerId) {
          if (blockedByViewer.includes(comment.authorId) || blockersOfViewer.includes(comment.authorId)) {
            continue;
          }
        }
        visibleComments.push(comment);
      }

      res.json(visibleComments.map(serializeComment));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
 * DELETE /comments/:id
 * Helper to delete comment (Author only)
 */
  async deleteComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const authorId = req.user?.sub;

      const comment = await CommentModel.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.authorId !== authorId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await CommentModel.deleteOne({ _id: id });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
