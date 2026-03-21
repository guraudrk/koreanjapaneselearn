import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PointsService } from './points.service';
import type { AuthRequest } from '../../interfaces/auth-request.interface';

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
