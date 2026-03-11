import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PointsService } from './points.service';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  getBalance(@Req() req: AuthRequest) {
    return this.pointsService.getBalance(req.user.id);
  }

  @Get('leaderboard')
  getLeaderboard(@Req() req: AuthRequest, @Query('scope') scope: 'global' = 'global') {
    return this.pointsService.getLeaderboard(req.user.id, scope);
  }
}
