import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  @ApiOkResponse({ description: 'Service is healthy and DB is reachable' })
  async health() {
    let dbOk = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {}
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbOk ? 'up' : 'down',
    };
  }
}