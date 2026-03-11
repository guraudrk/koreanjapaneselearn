import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  private generateCode(): string {
    return randomBytes(6).toString('base64url').slice(0, 8);
  }

  async createShare(userId: string, lessonId: string) {
    // Reuse existing share if already exists for this user+lesson
    const existing = await this.prisma.shareLink.findFirst({
      where: { userId, lessonId },
    });
    if (existing) {
      return { code: existing.code };
    }

    let code = this.generateCode();
    // Ensure uniqueness
    while (await this.prisma.shareLink.findUnique({ where: { code } })) {
      code = this.generateCode();
    }

    const link = await this.prisma.shareLink.create({
      data: { userId, lessonId, code },
    });
    return { code: link.code };
  }

  async getShare(code: string) {
    const link = await this.prisma.shareLink.findUnique({
      where: { code },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            curriculum: { select: { title: true, language: true } },
            cards: {
              select: { id: true, en: true, ko: true, ja: true, koReading: true, jaReading: true, type: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!link) throw new NotFoundException('Share link not found');

    return {
      code: link.code,
      lesson: link.lesson,
    };
  }
}
