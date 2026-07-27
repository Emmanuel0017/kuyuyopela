import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty() @IsString() city!: string;
  @ApiProperty() @IsString() address!: string;
  @ApiProperty() @IsString() phone!: string;
}