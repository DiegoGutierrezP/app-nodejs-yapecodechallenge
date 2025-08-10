import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PersistenceLayerModule } from '../persistence/persistence.module';
import { SaveTransactionCommandHandler } from './features/commands/save-transaction/save-transaction.command.handler';
import { UpdateTransactionCommandHandler } from './features/commands/update-transaction/update-transaction.command.handler';
import { GetTransactionByExternalIdQueryHandler } from './features/queries/get-transaction/get-transaction-by-external-id.query.handler';

@Module({
  imports: [CqrsModule.forRoot(), PersistenceLayerModule],
  providers: [
    // Commands
    SaveTransactionCommandHandler,
    UpdateTransactionCommandHandler,
    // Queries
    GetTransactionByExternalIdQueryHandler,
  ],
  exports: [],
})
export class ApplicationLayerModule {}
