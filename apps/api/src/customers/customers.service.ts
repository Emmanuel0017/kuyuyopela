import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const customers = await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { orders: { select: { total: true, status: true } } },
    });
    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
      orderCount: c.orders.length,
      totalSpent: c.orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((s, o) => s + o.total, 0),
    }));
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { orders: { include: { items: true } } },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    // hard delete — orders reference customer with onDelete default (Restrict)
    // safer to anonymize; for now hard delete is OK for admin actions
    return this.prisma.customer.delete({ where: { id } });
  }
}