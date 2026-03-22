import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { GroqService } from './groq.service';
import { AuthModule } from './auth/auth.module';
import { BuildingsModule } from './buildings/buildings.module';

@Module({
  imports: [AuthModule, BuildingsModule],
  controllers: [AppController],
  providers: [PrismaService, GroqService],
})
export class AppModule {}
