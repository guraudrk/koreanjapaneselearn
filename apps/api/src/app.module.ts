import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { LearningModule } from './modules/learning/learning.module';
import { PointsModule } from './modules/points/points.module';
import { ShareModule } from './modules/share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CurriculumModule,
    DictionaryModule,
    LearningModule,
    PointsModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
