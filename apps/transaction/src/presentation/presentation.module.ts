import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { HealthController } from './controllers/health.controller';
import { ApplicationLayerModule } from '../application/application.module';
import { SeedController } from './controllers/seed.controller';
import { PersistenceLayerModule } from '../persistence/persistence.module';

@Module({
  imports: [ApplicationLayerModule, PersistenceLayerModule],
  controllers: [HealthController, TransactionController, SeedController],
  providers: [],
  exports: [],
})
export class PresentationLayerModule {}
