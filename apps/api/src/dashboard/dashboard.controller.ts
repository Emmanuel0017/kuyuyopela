import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOkResponse({ description: 'Top-line KPI numbers' })
  stats() {
    return this.dashboardService.getStats();
  }

  @Get('weekly-sales')
  @ApiOkResponse({ description: 'Sales totals grouped by day-of-week, last 7 days' })
  weeklySales() {
    return this.dashboardService.getWeeklySales();
  }

  @Get('activity')
  @ApiOkResponse({ description: 'Latest activity across orders, agents, and stock' })
  activity() {
    return this.dashboardService.getRecentActivity();
  }
}