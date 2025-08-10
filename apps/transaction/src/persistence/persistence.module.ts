import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionType } from '../domain/entities';
import { TransactionRepository } from './repositories/transaction.repository';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_TYPE_REPOSITORY,
} from '../domain/repositories';
import { TransactionTypeRepository } from './repositories';

@Module({
  imports: [
    DatabaseModule,
    //Entities definition
    TypeOrmModule.forFeature([Transaction, TransactionType]),
  ],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    {
      provide: TRANSACTION_TYPE_REPOSITORY,
      useClass: TransactionTypeRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY, TRANSACTION_TYPE_REPOSITORY],
})
export class PersistenceLayerModule {}
