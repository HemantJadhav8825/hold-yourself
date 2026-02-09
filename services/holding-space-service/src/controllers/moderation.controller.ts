import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ShareModel } from '../models/Share';
import { CommentModel } from '../models/Comment';

export class ModerationController {
  /**
   * PATCH /internal/moderation/share/:id/shadow
   * Admin-only shadow limiting of a share.
   */
  async shadowLimitShare(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isShadowLimited } = req.body;
      const adminId = req.user?.sub;

      const share = await ShareModel.findById(id);
      if (!share) {
        return res.status(404).json({ error: 'Share not found' });
      }

      share.isShadowLimited = !!isShadowLimited;
      await share.save();

      // TODO: Log moderation action if needed in internal audit log
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PATCH /internal/moderation/comment/:id/shadow
   * Admin-only shadow limiting of a comment.
   */
  async shadowLimitComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isShadowLimited } = req.body;

      const comment = await CommentModel.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      comment.isShadowLimited = !!isShadowLimited;
      await comment.save();

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
