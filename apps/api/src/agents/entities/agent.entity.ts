import { ApiProperty } from '@nestjs/swagger';
import { AgentStatus } from '@prisma/client';

export class AgentEntity {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ required: false, nullable: true, type: String }) email?: string | null;
  @ApiProperty() city!: string;
  @ApiProperty() phone!: string;
  @ApiProperty({ required: false, nullable: true, type: String }) note?: string | null;
  @ApiProperty({ enum: AgentStatus }) status!: AgentStatus;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}