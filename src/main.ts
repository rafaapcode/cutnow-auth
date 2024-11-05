import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['https://cutnow-frontend.vercel.app'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
