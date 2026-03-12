import { Controller, Get, Patch, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

interface AuthRequest extends Request {
  user: { id: string; email: string; nativeLanguage: string; settings: unknown };
}

@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getMe(@Req() req: AuthRequest) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new UnauthorizedException('User not found');
    return {
      id: user.id,
      email: user.email,
      nativeLanguage: user.nativeLanguage,
      settings: user.settings,
    };
  }

  @Patch('settings')
  async updateSettings(@Req() req: AuthRequest, @Body() dto: UpdateSettingsDto) {
    return this.usersService.updateSettings(req.user.id, dto);
  }
}
