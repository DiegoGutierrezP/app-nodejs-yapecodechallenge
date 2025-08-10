import { Module } from '@nestjs/common';
import { KafkaModule } from './services/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [],
  exports: [KafkaModule],
})
export class InfrastructureLayerModule {}
