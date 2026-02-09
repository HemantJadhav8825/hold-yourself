import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SupportModel } from '../models/Support';
import { serializeSupport } from '../services/support.serializer';

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
