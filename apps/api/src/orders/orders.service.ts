import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { assertValidTransition } from './order-status.util';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are unavailable');
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
    }

    const total = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email: dto.customerEmail },
        update: { name: dto.customerName, phone: dto.customerPhone },
        create: { name: dto.customerName, email: dto.customerEmail, phone: dto.customerPhone },
      });

      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          total,
          address: dto.address,
          city: dto.city,
          paymentMethod: dto.paymentMethod ?? 'CASH_ON_DELIVERY',
          items: {
            create: dto.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
              };
            }),
          },
        },
        include: { items: true, customer: true },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    assertValidTransition(order.status, status);
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}