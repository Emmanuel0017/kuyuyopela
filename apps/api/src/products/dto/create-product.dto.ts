import { IsString, IsInt, Min, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() category!: string;
  @ApiProperty() @IsInt() @Min(0) price!: number;
  @ApiProperty() @IsInt() @Min(0) stock!: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty({ required: false, default: true }) @IsOptional() @IsBoolean() isActive?: boolean;
}