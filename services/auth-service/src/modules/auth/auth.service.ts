import { UserService } from '../users/user.service';
import { TokenService } from '../tokens/token.service';
import { PasswordHasher } from '../../security/password';
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
    // Logic to verify refresh token and issue new access token
    // This would involve JwtSigner.verify and checking revocation list
    throw new Error('Not implemented');
  }
}
