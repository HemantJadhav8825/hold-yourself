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

      const response: UserProfileResponseDTO = {
        id: user.id || user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
