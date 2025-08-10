import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { HealthController } from './controllers/health.controller';
import { ApplicationLayerModule } from '../application/application.module';

@Module({
  imports: [ApplicationLayerModule],
  controllers: [HealthController, TransactionController],
  providers: [],
  exports: [],
})
export class PresentationLayerModule {}
