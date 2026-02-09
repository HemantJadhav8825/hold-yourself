import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentModel } from '../models/Comment';
import { ShareModel } from '../models/Share';
import { serializeComment, serializeComments } from '../services/comment.serializer';
import { checkRapidCommenting } from '../utils/friction';

export class CommentController {
  /**
   * POST /shares/:id/comments
   * Adds a comment if enabled by author. Enforces friction.
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

      // 2. share check & commentsEnabled enforcement
      const share = await ShareModel.findById(shareId);
      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      if (!share.commentsEnabled) {
        return res.status(403).json({ error: 'Comments are disabled for this share' });
      }

      // 3. Validation
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
   */
  async getComments(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const { limit = 50 } = req.query;

      const comments = await CommentModel.find({
        shareId,
        isShadowLimited: false,
      })
      .sort({ createdAt: 1 }) // Strictly ASC for conversation natural flow
      .limit(Number(limit));

      // No counts, no aggregation.
      res.json(serializeComments(comments));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
