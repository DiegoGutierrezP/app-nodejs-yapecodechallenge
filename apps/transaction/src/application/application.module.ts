import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PersistenceLayerModule } from '../persistence/persistence.module';
import { SaveTransactionCommandHandler } from './features/commands/save-transaction/save-transaction.command.handler';
import { UpdateTransactionCommandHandler } from './features/commands/update-transaction/update-transaction.command.handler';
import { GetTransactionByExternalIdQueryHandler } from './features/queries/get-transaction/get-transaction-by-external-id.query.handler';
import { InfrastructureLayerModule } from '../infrastructure/infrastructure.module';
import { AuthorizeTransactionCommandHandler } from './features/commands/authorize-transaction/authorize-transaction.command.handler';

@Module({
  imports: [
    CqrsModule.forRoot(),
    PersistenceLayerModule,
    InfrastructureLayerModule,
  ],
  providers: [
    // Commands
    SaveTransactionCommandHandler,
    UpdateTransactionCommandHandler,
    AuthorizeTransactionCommandHandler,
    // Queries
    GetTransactionByExternalIdQueryHandler,
  ],
  exports: [],
})
export class ApplicationLayerModule {}
