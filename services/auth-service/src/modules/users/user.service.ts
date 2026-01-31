import { User, UserCreateDTO } from './user.model';

export class UserService {
  // Abstracted database operations
  private static users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return UserService.users.find(u => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return UserService.users.find(u => u.id === id) || null;
  }

  async createUser(data: UserCreateDTO): Promise<User> {
    const user: User = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
      isRevoked: false,
    };
    UserService.users.push(user);
    return user;
  }
}
