import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ConversationService } from './conversation.service';

export class ConversationController {
  static async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.sub;
      const conversations = await ConversationService.listConversations(userId);
      res.json(conversations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.sub;
      const { recipientId } = req.body;

      if (!recipientId) {
        return res.status(400).json({ error: 'recipientId is required' });
      }

      const conversation = await ConversationService.findOrCreateConversation(userId, recipientId);
      res.status(201).json(conversation);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
