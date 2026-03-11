import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LearningService } from './learning.service';

interface AuthRequest extends Request {
  user: { id: string };
}

class SubmitDto {
  lessonId: string;
  cardId?: string;
  correct: boolean;
  latencyMs?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post('submit')
  submit(@Req() req: AuthRequest, @Body() dto: SubmitDto) {
    return this.learningService.submit(req.user.id, dto);
  }

  @Get('progress')
  getProgress(@Req() req: AuthRequest) {
    return this.learningService.getProgress(req.user.id);
  }
}
