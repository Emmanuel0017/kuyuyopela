import { ApiProperty } from '@nestjs/swagger';

export class CustomerEntity {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() email!: string;
  @ApiProperty() phone!: string;
  @ApiProperty() orderCount!: number;
  @ApiProperty() totalSpent!: number;
  @ApiProperty() createdAt!: Date;
}