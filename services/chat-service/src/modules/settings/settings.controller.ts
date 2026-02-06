import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { SettingsService } from './settings.service';

export class SettingsController {
  static async get(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.sub;
      const settings = await SettingsService.getSettings(userId);
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.sub;
      const { showReadReceipts } = req.body;
      const settings = await SettingsService.updateSettings(userId, { showReadReceipts });
      res.json(settings);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
