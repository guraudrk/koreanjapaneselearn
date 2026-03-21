import { Controller, Post, Get, Body, Req, Query, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { TranslateDto } from './dto/translate.dto';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('translate-explain')
  translate(@Req() req: AuthRequest, @Body() dto: TranslateDto) {
    return this.aiService.translateExplain(req.user.id, dto);
  }

  @Get('tip')
  tip(@Query('locale') locale: string) {
    return this.aiService.generateTip(locale || 'en');
  }
}
