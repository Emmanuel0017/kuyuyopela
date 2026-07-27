import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '@prisma/client';

class OrderItemEntity {
  @ApiProperty() id!: string;
  @ApiProperty() productId!: string;
  @ApiProperty() productName!: string;
  @ApiProperty() unitPrice!: number;
  @ApiProperty() quantity!: number;
}

class CustomerEntity {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() email!: string;
  @ApiProperty() phone!: string;
}

export class OrderEntity {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: OrderStatus }) status!: OrderStatus;
  @ApiProperty({ enum: PaymentMethod }) paymentMethod!: PaymentMethod;
  @ApiProperty() total!: number;
  @ApiProperty() address!: string;
  @ApiProperty() city!: string;
  @ApiProperty({ type: CustomerEntity }) customer!: CustomerEntity;
  @ApiProperty({ type: [OrderItemEntity] }) items!: OrderItemEntity[];
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}