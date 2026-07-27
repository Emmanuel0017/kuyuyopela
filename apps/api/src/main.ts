import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // security
  app.use(helmet());
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:5174').split(','),
    credentials: true,
  });

  // global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // strip @Expose / @Exclude decorators consistently
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // rate limiting
  const { ThrottlerModule } = await import('@nestjs/throttler');
  // (registered in AppModule — see below)

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Kuyuyopela API')
    .setDescription('Backend for the storefront and admin dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Admin authentication')
    .addTag('products', 'Product catalog')
    .addTag('orders', 'Customer orders')
    .addTag('customers', 'Customer records')
    .addTag('agents', 'Sales agent applications')
    .addTag('stores', 'Store / stockist locations')
    .addTag('testimonials', 'Customer testimonials')
    .addTag('settings', 'Site configuration')
    .addTag('dashboard', 'Admin dashboard aggregates')
    .addTag('health', 'Health check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api/v1`);
  console.log(`📚 Docs at  http://localhost:${port}/api/docs`);
}
bootstrap();