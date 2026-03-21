import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';

@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: { user: { id: string } }, @Body() dto: CreateShareDto) {
    return this.shareService.createShare(req.user.id, dto.lessonId);
  }

  @Get(':code')
  get(@Param('code') code: string) {
    return this.shareService.getShare(code);
  }
}
