import { IsEnum } from 'class-validator';
import { AgentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgentStatusDto {
  @ApiProperty({ enum: AgentStatus })
  @IsEnum(AgentStatus)
  status!: AgentStatus;
}