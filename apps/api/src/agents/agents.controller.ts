import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AgentStatus } from '@prisma/client';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AgentEntity } from './entities/agent.entity';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: AgentEntity, isArray: true })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  findAll(@Query('status') status?: AgentStatus) {
    return this.agentsService.findAll(status);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AgentEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  // public — storefront "become an agent" application form
  @Post()
  @ApiOkResponse({ type: AgentEntity })
  create(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AgentEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  setStatus(@Param('id') id: string, @Body() dto: UpdateAgentStatusDto) {
    return this.agentsService.setStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AgentEntity })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}