import { ApiProperty } from '@nestjs/swagger';

export class ActivityEntity {
  @ApiProperty() kind!: string;
  @ApiProperty() text!: string;
  @ApiProperty() at!: Date;
  @ApiProperty() timeAgo!: string;
}