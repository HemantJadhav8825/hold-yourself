import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentModel, IComment } from '../models/Comment';
import { ShareModel } from '../models/Share';
import { serializeComment, serializeComments } from '../services/comment.serializer';
import { checkRapidCommenting } from '../utils/friction';
import { BlockService } from '../services/block.service';

export class CommentController {
  /**
   * POST /shares/:id/comments
   * Adds a comment if enabled by author. Enforces friction and blocks.
   */
  async createComment(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const { content } = req.body;
      const authorId = req.user?.sub;

      if (!authorId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      // 1. Friction Check
      await checkRapidCommenting(authorId);

      // 2. Share check & commentsEnabled enforcement
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

      // 4. Validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      if (content.length > 1000) {
        return res.status(400).json({ error: 'Comment too long (max 1000)' });
      }

      const comment = await CommentModel.create({
        shareId,
        authorId,
        content: content.trim(),
      });

      res.status(201).json(serializeComment(comment));
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  /**
   * GET /shares/:id/comments
   * Flat list of comments, strictly chronological ASC.
   * Respects shadow limiting and blocks.
   */
  async getComments(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const { limit = 50 } = req.query;
      const viewerId = req.user?.sub;

      const potentialComments = await CommentModel.find({ shareId })
      .sort({ createdAt: 1 })
      .limit(Number(limit) * 2);

      const visibleComments: IComment[] = [];

      for (const comment of potentialComments) {
        if (visibleComments.length >= Number(limit)) break;

        // 1. Shadow limiting: Only author sees own shadow-limited comment
        if (comment.isShadowLimited && comment.authorId !== viewerId) {
          continue;
        }

        // 2. Block check
        if (viewerId) {
          const isBlocked = await BlockService.isBlockedMutual(viewerId, comment.authorId);
          if (isBlocked) continue;
        }

        visibleComments.push(comment);
      }

      res.json(serializeComments(visibleComments));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
