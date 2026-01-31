import { UserService } from '../users/user.service';
import { TokenService } from '../tokens/token.service';
import { PasswordHasher } from '../../security/password';
import { JwtSigner } from '../../security/jwt';
import { CONSTANTS } from '../../config/constants';

const userService = new UserService();
const tokenService = new TokenService();

export class AuthService {
  async register(data: any) {
    const existing = await userService.findByEmail(data.email);
    if (existing) throw new Error('User already exists');

    const passwordHash = await PasswordHasher.hash(data.password);
    return userService.createUser({
      email: data.email,
      passwordHash,
      role: CONSTANTS.ROLES.USER,
      scopes: [CONSTANTS.SCOPES.READ],
    });
  }

  async login(email: string, pass: string) {
    const user = await userService.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await PasswordHasher.compare(pass, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    return tokenService.issueTokens(user);
  }

  async refresh(token: string) {
    try {
      const payload = JwtSigner.verify(token);
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      const user = await userService.findById(payload.sub);
      if (!user || user.isRevoked) {
        throw new Error('User not found or revoked');
      }

      return tokenService.issueTokens(user);
    } catch (err: any) {
      throw new Error('Invalid refresh token: ' + err.message);
    }
  }
}
