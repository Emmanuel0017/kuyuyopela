import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty() @IsString() city!: string;
  @ApiProperty() @IsString() phone!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
}