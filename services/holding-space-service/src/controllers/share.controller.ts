import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ShareModel, IShare } from '../models/Share';
import { UserPreferenceModel } from '../models/UserPreference';
import { serializeShare, serializeShares } from '../services/share.serializer';
import { assertChronologicalOnly } from '../guardrails';
import { canViewerSeeShare } from '../middleware/visibility';

export class ShareController {
  /**
   * POST /shares
   * Creates a new share for expression.
   */
  async createShare(req: AuthRequest, res: Response) {
    try {
      const { content, visibility, anonymous, sensitivityTags } = req.body;
      const authorId = req.user?.sub;

      if (!authorId) {
        return res.status(401).json({ error: 'Author ID not found in token' });
      }

      // Validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      if (content.length > 2000) {
        return res.status(400).json({ error: 'Content exceeds 2000 characters' });
      }

      // Milestone 3 optional inputs
      const safeVisibility = (visibility === 'followers') ? 'followers' : 'public';
      const isAnonymous = !!anonymous;
      
      let safeTags: string[] = [];
      if (Array.isArray(sensitivityTags)) {
        safeTags = [...new Set(
          sensitivityTags
            .map(t => String(t).trim().toLowerCase())
            .filter(t => t.length > 0 && t.length < 30)
        )].slice(0, 5);
      }

      const share = await ShareModel.create({
        authorId,
        content: content.trim(),
        visibility: safeVisibility,
        anonymous: isAnonymous,
        commentsEnabled: true,
        sensitivityTags: safeTags,
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
   * Chronological feed with cursor-based pagination and visibility filtering.
   */
  async getShares(req: AuthRequest, res: Response) {
    try {
      const { sort, order, cursor, limit = 20 } = req.query;
      const viewerId = req.user?.sub;

      // Enforce emotional safety guardrails
      assertChronologicalOnly({ sort: sort as string, order: order as string });

      const query: any = { isShadowLimited: false };

      if (cursor) {
        query.createdAt = { $lt: new Date(cursor as string) };
      }

      // Load viewer preferences for muted tags
      let mutedTags: string[] = [];
      if (viewerId) {
        const pref = await UserPreferenceModel.findOne({ userId: viewerId });
        if (pref) mutedTags = pref.mutedTags;
      }

      // Fetch potential shares (oversampling slightly to account for visibility filtering)
      const potentialShares = await ShareModel.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 2); // Oversample

      const visibleShares: IShare[] = [];
      
      for (const share of potentialShares) {
        if (visibleShares.length >= Number(limit)) break;

        // 1. Visibility Check
        const isVisible = await canViewerSeeShare(viewerId || '', share);
        if (!isVisible) continue;

        // 2. Personal Topic Filtering (Muted Tags)
        if (mutedTags.length > 0 && share.sensitivityTags.length > 0) {
          const isMuted = share.sensitivityTags.some(tag => mutedTags.includes(tag));
          if (isMuted) continue;
        }

        visibleShares.push(share);
      }

      // Chronological ordering is mandatory for emotional safety.
      res.json(serializeShares(visibleShares));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
