import { User, UserCreateDTO } from './user.model';
import { UserModel } from './user.schema';

export class UserService {
  async findByEmail(email: string): Promise<any | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<any | null> {
    return UserModel.findById(id).exec();
  }

  async createUser(data: UserCreateDTO): Promise<any> {
    const user = new UserModel({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      scopes: data.scopes,
    });
    return user.save();
  }
}
