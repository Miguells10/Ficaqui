import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('GOV_ADMIN')
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Get('buildings')
  getAll() {
    return this.buildingsService.getAllBuildings();
  }

  @Get('buildings/opportunities')
  getOpportunities() {
    return this.buildingsService.getOpportunities();
  }

  @Post('insights')
  generateInsights() {
    return this.buildingsService.generateInsights();
  }
}
