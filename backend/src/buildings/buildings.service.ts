import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GroqService } from '../groq.service';
import { BuildingStatus } from '@prisma/client';

@Injectable()
export class BuildingsService {
  private cache: { data: string | null; expiresAt: number } = { data: null, expiresAt: 0 };

  constructor(private prisma: PrismaService, private groqService: GroqService) {}

  async getAllBuildings() {
    return this.prisma.building.findMany();
  }

  async getOpportunities() {
    return this.prisma.building.findMany({
      where: {
        status: { in: [BuildingStatus.ABANDONED, BuildingStatus.MIXED_USE_POTENTIAL] }
      },
      orderBy: { footTrafficScore: 'desc' },
    });
  }

  async generateInsights() {
    const now = Date.now();
    // 15 minutos em milissegundos caching
    if (this.cache.data && this.cache.expiresAt > now) {
      return { insights: this.cache.data, cached: true };
    }

    const opportunities = await this.getOpportunities();
    const result = await this.groqService.getAdminInsights(opportunities);

    this.cache = { data: result, expiresAt: now + 15 * 60 * 1000 };
    return { insights: result, cached: false };
  }
}
