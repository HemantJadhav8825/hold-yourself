import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ReportModel } from '../models/Report';
import { ShareModel } from '../models/Share';
import { CommentModel } from '../models/Comment';

export class ReportController {
  /**
   * POST /reports
   * Creates a new user report with minimal feedback.
   */
  async createReport(req: AuthRequest, res: Response) {
    try {
      const reporterId = req.user?.sub;
      const { targetType, targetId, reason } = req.body;

      if (!reporterId) {
        return res.status(401).json({ error: 'User ID not found in token' });
      }

      if (!['share', 'comment'].includes(targetType)) {
        return res.status(400).json({ error: 'Invalid targetType' });
      }

      // Validate target existence
      const targetExists = targetType === 'share' 
        ? await ShareModel.exists({ _id: targetId })
        : await CommentModel.exists({ _id: targetId });

      if (!targetExists) {
        return res.status(404).json({ error: 'Target content not found' });
      }

      if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return res.status(400).json({ error: 'Reason is required' });
      }

      await ReportModel.create({
        reporterId,
        targetType,
        targetId,
        reason: reason.trim().slice(0, 500),
      });

      // Minimal acknowledgement for emotional safety (no investigation details)
      res.status(201).json({ message: 'Thank you for helping keep Holding Space safe.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
