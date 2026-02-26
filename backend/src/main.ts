import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <-- necesario para que @Type(() => Date) funcione
    whitelist: true, // opcional: elimina props extras no declaradas en DTO
    forbidNonWhitelisted: true, // opcional: lanza error si vienen props no permitidas
    transformOptions: {
      enableImplicitConversion: true, // ayuda con conversiones simples
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('API Kanban')
    .setDescription('Documentación de la API de tareas')
    .setVersion('1.0')
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documento);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();