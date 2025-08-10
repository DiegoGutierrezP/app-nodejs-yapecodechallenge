import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

export const KAFKA_PRODUCER_SERVICE = 'KAFKA_PRODUCER_SERVICE';

export interface IKafkaProducerService extends OnModuleInit, OnModuleDestroy {
  sendMessage<T>(topic: string, message: any): Promise<T>;
  emitMessage(topic: string, message: any): void;
}
