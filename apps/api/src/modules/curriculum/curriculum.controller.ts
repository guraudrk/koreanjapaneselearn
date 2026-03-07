import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurriculumService } from './curriculum.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('curriculums')
  findAll() {
    return this.curriculumService.findAll();
  }

  @Get('curriculums/:id/lessons')
  findLessons(@Param('id') id: string) {
    return this.curriculumService.findLessons(id);
  }

  @Get('lessons/:id')
  findLesson(@Param('id') id: string) {
    return this.curriculumService.findLesson(id);
  }
}
