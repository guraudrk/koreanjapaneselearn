import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { settings: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { settings: true },
    });
  }

  async create(data: {
    email: string;
    password: string;
    nativeLanguage?: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        nativeLanguage: data.nativeLanguage ?? 'en',
        settings: {
          create: { learningMode: 'BOTH', notifications: true },
        },
      },
      include: { settings: true },
    });
  }

  async updateRefreshTokenHash(userId: string, hash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  async updateSettings(
    userId: string,
    data: { learningMode?: string; notifications?: boolean },
  ) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, learningMode: data.learningMode ?? 'BOTH', notifications: data.notifications ?? true },
      update: data,
    });
  }
}
