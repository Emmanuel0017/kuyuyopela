import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() phone!: string;
}