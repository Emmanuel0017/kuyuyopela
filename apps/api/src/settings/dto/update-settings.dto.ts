import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() siteName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() supportPhone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() supportEmail?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() whatsappNumber?: string;
  @ApiProperty({ required: false, nullable: true, type: String }) @IsOptional() @IsString() aboutImageUrl?: string | null;
}