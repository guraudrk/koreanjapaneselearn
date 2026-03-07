import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const curriculums = await this.prisma.curriculum.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { lessons: true } } },
    });
    return curriculums.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      language: c.language,
      level: c.level,
      order: c.order,
      lessonCount: c._count.lessons,
    }));
  }

  async findLessons(curriculumId: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id: curriculumId },
    });
    if (!curriculum) {
      throw new NotFoundException('Curriculum not found');
    }
    return this.prisma.lesson.findMany({
      where: { curriculumId },
      orderBy: { order: 'asc' },
      include: { _count: { select: { cards: true } } },
    });
  }

  async findLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        cards: { orderBy: { order: 'asc' } },
        curriculum: true,
      },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }
}
