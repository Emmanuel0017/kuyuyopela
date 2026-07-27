import { OrderStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function assertValidTransition(from: OrderStatus, to: OrderStatus) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new BadRequestException(`Cannot move order from ${from} to ${to}`);
  }
}