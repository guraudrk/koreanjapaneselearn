import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      nativeLanguage: dto.nativeLanguage,
    });
    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshHash(user.id, tokens.refreshToken);
    return { ...tokens, user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshHash(user.id, tokens.refreshToken);
    return { ...tokens, user: this.sanitize(user) };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }
    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) {
      throw new ForbiddenException('Access denied');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET ?? 'changeme-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'changeme-refresh-secret',
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async storeRefreshHash(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.usersService.updateRefreshTokenHash(userId, hash);
  }

  private sanitize(user: { id: string; email: string; nativeLanguage: string; settings: unknown }) {
    return {
      id: user.id,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      settings: user.settings,
    };
  }
}
