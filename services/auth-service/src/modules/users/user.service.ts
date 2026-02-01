import { User, UserCreateDTO } from './user.model';
import { UserModel } from './user.schema';

export class UserService {
  async findByEmail(email: string): Promise<any | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<any | null> {
    return UserModel.findById(id).exec();
  }

  async findByGoogleId(googleId: string): Promise<any | null> {
    return UserModel.findOne({ googleId }).exec();
  }

  async createUser(data: UserCreateDTO): Promise<any> {
    const user = new UserModel({
      email: data.email,
      passwordHash: data.passwordHash,
      authProvider: data.authProvider,
      googleId: data.googleId,
      avatar: data.avatar,
      role: data.role,
      scopes: data.scopes,
    });
    return user.save();
  }

  async updateUser(id: string, data: Partial<User>): Promise<any | null> {
    return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }
}
