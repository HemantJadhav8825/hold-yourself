import { Request, Response } from 'express';
import { VentService } from './vent.service';

export class VentController {
  private ventService: VentService;

  constructor() {
    this.ventService = new VentService();
  }

  async createVent(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub || req.body.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const vent = await this.ventService.create({
        ...req.body,
        author: userId,
      });
      res.status(201).json(vent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecentFeed(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const vents = await this.ventService.getRecentFeed(limit);
      res.json(vents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCircleFeed(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const vents = await this.ventService.findByCircle(req.params.circleId, limit, offset);
      res.json(vents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async addReaction(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub || req.body.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { type } = req.body;
      const vent = await this.ventService.addReaction(req.params.id, userId, type);
      res.json(vent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
