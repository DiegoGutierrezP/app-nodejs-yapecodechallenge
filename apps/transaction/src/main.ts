import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './presentation/filters/all-exception.filter';
import 'dotenv/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });

  app.setGlobalPrefix('api');

  // custom exception filter
  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
