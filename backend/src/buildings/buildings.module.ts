import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { PrismaService } from '../prisma.service';
import { GroqService } from '../groq.service';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService, PrismaService, GroqService]
})
export class BuildingsModule {}
