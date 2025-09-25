import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://project-app-indol.vercel.app',
      'http://localhost:3000',
      'https://projectapp-api-k8mo.onrender.com',
      'http://localhost:10000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  const Config = new DocumentBuilder()
    .setTitle('ProjectApp API')
    .setDescription('API documentation for ProjectApp')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .setLicense('MIT', 'https://opensource.org/license/mit/')
    .addServer('https://projectapp-api-k8mo.onrender.com', 'Production server')
    .build();

  const Swagger = SwaggerModule.createDocument(app, Config);

  const http = app.getHttpAdapter();
  http.get('/swagger.json', (_req: Request, res: Response) => {
    res.json(Swagger);
  });

  SwaggerModule.setup('', app, Swagger, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      urls: [{ url: '/swagger.json', name: 'ProjectApp API' }],
      spec: Swagger,
    },
  });

  await app.listen(process.env.PORT ?? 10000);
}
void bootstrap();
