import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() category!: string;
  @ApiProperty() price!: number;
  @ApiProperty() stock!: number;
  @ApiProperty({ required: false, nullable: true, type: String }) imageUrl?: string | null;
  @ApiProperty({ required: false, nullable: true, type: String }) description?: string | null;
  @ApiProperty() isActive!: boolean;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}