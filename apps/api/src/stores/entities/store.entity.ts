import { ApiProperty } from '@nestjs/swagger';

export class StoreEntity {
  @ApiProperty() id!: string;
  @ApiProperty() city!: string;
  @ApiProperty() address!: string;
  @ApiProperty() phone!: string;
}