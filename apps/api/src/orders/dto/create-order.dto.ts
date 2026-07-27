import { IsString, IsEmail, IsArray, ValidateNested, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

class OrderItemInput {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() customerName!: string;
  @ApiProperty() @IsEmail()  customerEmail!: string;
  @ApiProperty() @IsString() customerPhone!: string;

  @ApiProperty() @IsString() address!: string;
  @ApiProperty() @IsString() city!: string;

  @ApiProperty({ enum: PaymentMethod, required: false, default: PaymentMethod.CASH_ON_DELIVERY })
  @IsOptional() @IsEnum(PaymentMethod) paymentMethod?: PaymentMethod;

  @ApiProperty({ type: [OrderItemInput] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemInput)
  items!: OrderItemInput[];
}