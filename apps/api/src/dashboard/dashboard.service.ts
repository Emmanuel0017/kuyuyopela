import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [revenueAgg, totalOrders, pendingOrders, activeProducts, totalCustomers, recentOrders] =
      await Promise.all([
        this.prisma.order.aggregate({ _sum: { total: true } }),
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: 'PENDING' } }),
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.customer.count(),
        this.prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: true },
        }),
      ]);

    return {
      revenue: revenueAgg._sum.total ?? 0,
      totalOrders,
      pendingOrders,
      activeProducts,
      totalCustomers,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customer: { name: o.customer.name },
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      })),
    };
  }

  async getWeeklySales() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo }, status: { not: 'CANCELLED' } },
      select: { total: true, createdAt: true },
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const byDay: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    for (const o of orders) {
      const day = days[o.createdAt.getDay()];
      byDay[day] += o.total;
    }
    // return in Mon→Sun order for nice display
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => ({
      label,
      value: Math.round(byDay[label] / 1000), // thousands, for chart label
    }));
  }

  async getRecentActivity() {
    const [recentOrders, recentAgents, lowStock] = await Promise.all([
      this.prisma.order.findMany({ take: 3, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
      this.prisma.agent.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.findMany({ where: { stock: { gt: 0, lt: 10 } }, take: 2, orderBy: { stock: 'asc' } }),
    ]);

    const events = [
      ...recentOrders.map((o) => ({
        kind: 'order' as const,
        text: `Order #${o.id.slice(0, 8)} from ${o.customer.name}`,
        at: o.createdAt,
      })),
      ...recentAgents.map((a) => ({
        kind: 'agent' as const,
        text: `Agent application: ${a.name} (${a.city})`,
        at: a.createdAt,
      })),
      ...lowStock.map((p) => ({
        kind: 'product' as const,
        text: `Low stock: ${p.name} (${p.stock} left)`,
        at: new Date(), // current; stock status doesn't have its own timestamp
      })),
    ]
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, 8);

    return events.map((e) => ({
      ...e,
      at: e.at,
      timeAgo: this.timeAgo(e.at),
    }));
  }

  private timeAgo(d: Date): string {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  }
}