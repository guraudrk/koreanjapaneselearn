import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CurriculumModule,
    DictionaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
