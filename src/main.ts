import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Prefijo global para la API
  app.setGlobalPrefix('api');
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Deudas')
    .setDescription('API para gestionar deudas entre amigos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Operaciones de autenticación')
    .addTag('users', 'Operaciones de usuarios')
    .addTag('debts', 'Operaciones de deudas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
