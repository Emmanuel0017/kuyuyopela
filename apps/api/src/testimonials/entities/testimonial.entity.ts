import { ApiProperty } from '@nestjs/swagger';

export class TestimonialEntity {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() location!: string;
  @ApiProperty() rating!: number;
  @ApiProperty({ required: false, nullable: true, type: String }) note?: string | null;
  @ApiProperty({ required: false, nullable: true, type: String }) beforeImage?: string | null;
  @ApiProperty({ required: false, nullable: true, type: String }) afterImage?: string | null;
}