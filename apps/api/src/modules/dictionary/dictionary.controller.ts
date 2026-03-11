import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DictionaryService } from './dictionary.service';

@UseGuards(JwtAuthGuard)
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.dictionaryService.search(q ?? '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictionaryService.findOne(id);
  }
}
