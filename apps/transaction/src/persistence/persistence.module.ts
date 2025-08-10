import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../domain/entities';
import { TransactionRepository } from './repositories/transaction.repository';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_STATUS_REPOSITORY,
  TRANSACTION_TYPE_REPOSITORY,
} from '../domain/repositories';
import {
  TransactionStatusRepository,
  TransactionTypeRepository,
} from './repositories';

@Module({
  imports: [
    DatabaseModule,
    //Entities definition
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
  ],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    {
      provide: TRANSACTION_STATUS_REPOSITORY,
      useClass: TransactionStatusRepository,
    },
    {
      provide: TRANSACTION_TYPE_REPOSITORY,
      useClass: TransactionTypeRepository,
    },
  ],
  exports: [
    TRANSACTION_REPOSITORY,
    TRANSACTION_STATUS_REPOSITORY,
    TRANSACTION_TYPE_REPOSITORY,
  ],
})
export class PersistenceLayerModule {}
