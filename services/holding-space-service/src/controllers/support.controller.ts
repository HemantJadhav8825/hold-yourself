import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SupportModel } from '../models/Support';
import { ShareModel } from '../models/Share';
import { serializeSupport } from '../services/support.serializer';
import { BlockService } from '../services/block.service';

export class SupportController {
  /**
   * POST /shares/:id/support
   * Upserts a support reaction.
   */
  async toggleSupport(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const { type } = req.body;
      const userId = req.user?.sub;

      if (!userId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      if (!['WITH_YOU', 'HOLDING', 'HEARD', 'SUPPORT'].includes(type)) {
        return res.status(400).json({ error: 'Invalid support type' });
      }

      // 1. Share check
      const share = await ShareModel.findById(shareId);
      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      // 2. Block check: Cannot support if mutual block exists
      const isBlocked = await BlockService.isBlockedMutual(userId, share.authorId);
      if (isBlocked) {
        return res.status(403).json({ error: 'You cannot interact with this content' });
      }

      // Upsert logic: If support exists -> update type, else create new
      const support = await SupportModel.findOneAndUpdate(
        { userId, shareId },
        { type },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // NEVER return total supports, never modify Share document.
      res.json(serializeSupport(support));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /shares/:id/support
   * Removes current user's support.
   */
  async deleteSupport(req: AuthRequest, res: Response) {
    try {
      const { id: shareId } = req.params;
      const userId = req.user?.sub;

      if (!userId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      await SupportModel.deleteOne({ userId, shareId });

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
