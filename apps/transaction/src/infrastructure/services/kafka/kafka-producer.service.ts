import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IKafkaProducerService } from 'apps/transaction/src/application/contracts/services';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaProducerService implements IKafkaProducerService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async sendMessage<T>(topic: string, message: any) {
    return await lastValueFrom<T>(this.kafkaClient.send(topic, message));
  }

  emitMessage(topic: string, message: any) {
    this.kafkaClient.emit(topic, message);
  }
}
