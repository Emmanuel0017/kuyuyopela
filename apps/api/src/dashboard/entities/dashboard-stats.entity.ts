import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class RecentOrderEntity {
  @ApiProperty() id!: string;
  @ApiProperty() total!: number;
  @ApiProperty({ enum: OrderStatus }) status!: OrderStatus;
  @ApiProperty() createdAt!: Date;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  customer!: { name: string };
}

export class DashboardStatsEntity {
  @ApiProperty() revenue!: number;
  @ApiProperty() totalOrders!: number;
  @ApiProperty() pendingOrders!: number;
  @ApiProperty() activeProducts!: number;
  @ApiProperty() totalCustomers!: number;
  @ApiProperty({ type: [RecentOrderEntity] }) recentOrders!: RecentOrderEntity[];
}