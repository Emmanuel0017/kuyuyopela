import { ApiProperty } from '@nestjs/swagger';

export class WeeklySaleEntity {
  @ApiProperty() label!: string;
  @ApiProperty() value!: number;
}