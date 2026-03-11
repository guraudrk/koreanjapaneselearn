import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalAgg, todayAgg] = await Promise.all([
      this.prisma.pointsLedger.aggregate({
        where: { userId },
        _sum: { delta: true },
      }),
      this.prisma.pointsLedger.aggregate({
        where: { userId, createdAt: { gte: today } },
        _sum: { delta: true },
      }),
    ]);

    return {
      total: totalAgg._sum.delta ?? 0,
      todayEarned: todayAgg._sum.delta ?? 0,
    };
  }

  async getLeaderboard(userId: string, scope: 'global' = 'global') {
    void userId; void scope;
    const rows = await this.prisma.pointsLedger.groupBy({
      by: ['userId'],
      _sum: { delta: true },
      orderBy: { _sum: { delta: 'desc' } },
      take: 20,
    });

    return rows.map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      total: r._sum.delta ?? 0,
    }));
  }
}
