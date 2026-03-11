import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DictionaryService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: string) {
    if (!q || q.trim().length === 0) return [];
    return this.prisma.dictionaryEntry.findMany({
      where: {
        OR: [
          { en: { contains: q.trim(), mode: 'insensitive' } },
          { ko: { contains: q.trim(), mode: 'insensitive' } },
          { ja: { contains: q.trim(), mode: 'insensitive' } },
        ],
      },
      orderBy: { en: 'asc' },
      take: 20,
    });
  }

  async findOne(id: string) {
    const entry = await this.prisma.dictionaryEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }
}
