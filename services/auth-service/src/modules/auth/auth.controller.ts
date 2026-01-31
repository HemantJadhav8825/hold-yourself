import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
}
