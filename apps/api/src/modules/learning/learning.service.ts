import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const POINTS_CORRECT = 10;
const POINTS_LESSON_COMPLETE = 50;

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(
    userId: string,
    dto: { lessonId: string; cardId?: string; correct: boolean; latencyMs?: number },
  ) {
    const [progress] = await this.prisma.$transaction([
      this.prisma.userProgress.create({
        data: {
          userId,
          lessonId: dto.lessonId,
          cardId: dto.cardId ?? null,
          correct: dto.correct,
          latencyMs: dto.latencyMs ?? null,
        },
      }),
    ]);

    let pointsAwarded = 0;
    if (dto.correct) {
      pointsAwarded += POINTS_CORRECT;
      await this.prisma.pointsLedger.create({
        data: {
          userId,
          delta: POINTS_CORRECT,
          reason: 'CARD_CORRECT',
          refId: dto.cardId ?? dto.lessonId,
        },
      });
    }

    // Check if lesson is complete (all cards answered correctly at least once)
    if (dto.cardId) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: dto.lessonId },
        include: { _count: { select: { cards: true } } },
      });
      const correctCount = await this.prisma.userProgress.count({
        where: { userId, lessonId: dto.lessonId, correct: true },
      });
      if (lesson && correctCount >= lesson._count.cards) {
        const alreadyAwarded = await this.prisma.pointsLedger.findFirst({
          where: { userId, reason: 'LESSON_COMPLETE', refId: dto.lessonId },
        });
        if (!alreadyAwarded) {
          pointsAwarded += POINTS_LESSON_COMPLETE;
          await this.prisma.pointsLedger.create({
            data: {
              userId,
              delta: POINTS_LESSON_COMPLETE,
              reason: 'LESSON_COMPLETE',
              refId: dto.lessonId,
            },
          });
        }
      }
    }

    const totalPoints = await this.getTotalPoints(userId);
    return { correct: dto.correct, pointsAwarded, totalPoints, progressId: progress.id };
  }

  async getProgress(userId: string) {
    const [completedCards, correctCards] = await Promise.all([
      this.prisma.userProgress.count({ where: { userId } }),
      this.prisma.userProgress.count({ where: { userId, correct: true } }),
    ]);
    const totalPoints = await this.getTotalPoints(userId);
    return {
      completedCards,
      correctCards,
      correctRate: completedCards > 0 ? Math.round((correctCards / completedCards) * 100) : 0,
      totalPoints,
    };
  }

  private async getTotalPoints(userId: string): Promise<number> {
    const agg = await this.prisma.pointsLedger.aggregate({
      where: { userId },
      _sum: { delta: true },
    });
    return agg._sum.delta ?? 0;
  }
}
