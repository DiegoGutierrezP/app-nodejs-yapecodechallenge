import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
