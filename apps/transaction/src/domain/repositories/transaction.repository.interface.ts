import { Transaction } from '../entities';
import { IGenericRepository } from './generic.repository.interface';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface ITransactionRepository
  extends IGenericRepository<Transaction> {
  findByExternalId(externalId: string): Promise<Transaction | null>;
}
