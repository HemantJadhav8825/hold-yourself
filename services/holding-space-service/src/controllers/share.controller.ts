import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ShareModel } from '../models/Share';
import { serializeShare, serializeShares } from '../services/share.serializer';
import { assertChronologicalOnly } from '../guardrails';

export class ShareController {
  /**
   * POST /shares
   * Creates a new share for expression.
   */
  async createShare(req: AuthRequest, res: Response) {
    try {
      const { content } = req.body;
      const authorId = req.user?.sub;

      if (!authorId) {
        return res.status(401).json({ error: 'Author ID not found in token' });
      }

      // Validation logic (assuming Zod or similar if needed, but here simple)
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required and cannot be empty' });
      }

      if (content.length > 2000) {
        return res.status(400).json({ error: 'Content exceeds 2000 characters' });
      }

      const share = await ShareModel.create({
        authorId,
        content: content.trim(),
        visibility: 'public',
        anonymous: false, // Milestone 1 restriction
        commentsEnabled: true,
      });

      // Shares exist for expression, not performance.
      res.status(201).json(serializeShare(share));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PATCH /shares/:id
   * Updates an existing share. Only author can edit.
   */
  async updateShare(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content, commentsEnabled } = req.body;
      const authorId = req.user?.sub;

      const share = await ShareModel.findById(id);

      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      if (share.authorId !== authorId) {
        return res.status(403).json({ error: 'Forbidden: You are not the author of this share' });
      }

      if (content !== undefined) {
        if (typeof content !== 'string' || content.trim().length === 0) {
          return res.status(400).json({ error: 'Content cannot be empty' });
        }
        share.content = content.trim();
      }

      if (commentsEnabled !== undefined) {
        share.commentsEnabled = !!commentsEnabled;
      }

      await share.save();

      res.json(serializeShare(share));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /shares/:id
   * Deletes an existing share. Only author can delete.
   */
  async deleteShare(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const authorId = req.user?.sub;

      const share = await ShareModel.findById(id);

      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      if (share.authorId !== authorId) {
        return res.status(403).json({ error: 'Forbidden: You are not the author of this share' });
      }

      await ShareModel.deleteOne({ _id: id });

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /shares
   * Chronological feed with cursor-based pagination.
   */
  async getShares(req: AuthRequest, res: Response) {
    try {
      const { sort, order, cursor, limit = 20 } = req.query;

      // Enforce emotional safety guardrails
      assertChronologicalOnly({ sort: sort as string, order: order as string });

      const query: any = { isShadowLimited: false };

      if (cursor) {
        // Cursor-based pagination: createdAt < cursor
        query.createdAt = { $lt: new Date(cursor as string) };
      }

      // Always sort by createdAt DESC
      // Chronological ordering is mandatory for emotional safety.
      const shares = await ShareModel.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      res.json(serializeShares(shares));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
