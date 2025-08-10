import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, TRANSACTION_SERVICE } from './config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: [envs.kafkaBroker],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
