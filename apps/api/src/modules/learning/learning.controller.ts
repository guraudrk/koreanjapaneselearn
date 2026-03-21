import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LearningService } from './learning.service';
import type { AuthRequest } from '../../interfaces/auth-request.interface';

class SubmitDto {
  @IsString()
  lessonId: string;

  @IsOptional()
  @IsString()
  cardId?: string;

  @IsBoolean()
  correct: boolean;

  @IsOptional()
  @IsNumber()
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
