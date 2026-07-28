import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardStatsEntity } from './entities/dashboard-stats.entity';
import { WeeklySaleEntity } from './entities/weekly-sale.entity';
import { ActivityEntity } from './entities/activity.entity';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOkResponse({ type: DashboardStatsEntity })
  stats() {
    return this.dashboardService.getStats();
  }

  @Get('weekly-sales')
  @ApiOkResponse({ type: WeeklySaleEntity, isArray: true })
  weeklySales() {
    return this.dashboardService.getWeeklySales();
  }

  @Get('activity')
  @ApiOkResponse({ type: ActivityEntity, isArray: true })
  activity() {
    return this.dashboardService.getRecentActivity();
  }
}