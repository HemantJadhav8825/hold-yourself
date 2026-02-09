import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BlockModel } from '../models/Block';

export class BlockController {
  /**
   * POST /block/:userId
   * Mutually silences content between users.
   */
  async blockUser(req: AuthRequest, res: Response) {
    try {
      const blockerId = req.user?.sub;
      const { userId: blockedUserId } = req.params;

      if (!blockerId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      if (blockerId === blockedUserId) {
        return res.status(400).json({ error: 'You cannot block yourself' });
      }

      await BlockModel.findOneAndUpdate(
        { blockerId, blockedUserId },
        { blockerId, blockedUserId },
        { upsert: true, new: true }
      );

      // Silent 204
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /block/:userId
   * Removes a block relationship.
   */
  async unblockUser(req: AuthRequest, res: Response) {
    try {
      const blockerId = req.user?.sub;
      const { userId: blockedUserId } = req.params;

      if (!blockerId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      await BlockModel.deleteOne({ blockerId, blockedUserId });

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
