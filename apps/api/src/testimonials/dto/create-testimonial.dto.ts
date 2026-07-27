import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() location!: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) rating!: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() beforeImage?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() afterImage?: string;
}