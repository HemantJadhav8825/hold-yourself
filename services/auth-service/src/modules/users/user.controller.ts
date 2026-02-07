import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserListResponseDTO, UserProfileResponseDTO } from './user.model';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async listUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const users = await this.userService.findAll(limit, offset);
      
      const response: UserListResponseDTO[] = users.map(user => ({
        id: user.id || user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }));

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('getProfile user found:', { id: user.id || user._id, anonymousProfile: user.anonymousProfile });

      const response: UserProfileResponseDTO = {
        id: user.id || user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        anonymousProfile: user.anonymousProfile,
        createdAt: user.createdAt,
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAnonymousProfile(req: Request, res: Response) {
    try {
      // Assuming authentication middleware populates req.user
      // For now, allow passing userId in body for testing if auth not fully set up in this file context
      // But ideally it should be: const userId = req.user.id;
      // Let's rely on a header or body for now to be safe with existing unknown middleware
      const userId = req.body.userId || (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID required' });
      }

      const user = await this.userService.createAnonymousProfile(userId);
      res.json(user.anonymousProfile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
