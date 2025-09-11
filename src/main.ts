import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: ['project-app-indol.vercel.app', 'project-app-ashishziniyas-projects.vercel.app', 'project-l7qo10dv6-ashishziniyas-projects.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  await app.listen(process.env.PORT ?? 10000, () => {
    console.log(`Server is running on https://projectapp-api-k8mo.onrender.com`);
  });
}
void bootstrap();
