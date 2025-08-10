import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_PRODUCER_SERVICE } from 'apps/transaction/src/application/contracts/services';
import { KafkaProducerService } from './kafka-producer.service';
import { ANTI_FRAUD_SERVICE, envs } from 'apps/transaction/src/shared/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ANTI_FRAUD_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [envs.kafkaBroker],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: KAFKA_PRODUCER_SERVICE,
      useClass: KafkaProducerService,
    },
  ],
  exports: [KAFKA_PRODUCER_SERVICE],
})
export class KafkaModule {}
