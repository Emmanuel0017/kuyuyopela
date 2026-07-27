import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AgentsModule } from './agents/agents.module';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';
import { SettingsModule } from './settings/settings.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000,   limit: 5 },   // 5 req / second
      { name: 'long',  ttl: 60000,  limit: 100 }, // 100 req / minute
    ]),
    PrismaModule,
    AuthModule,
    StorageModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,    // ← NEW
    AgentsModule,
    StoresModule,
    TestimonialsModule,
    SettingsModule,
    DashboardModule,    // ← NEW
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}