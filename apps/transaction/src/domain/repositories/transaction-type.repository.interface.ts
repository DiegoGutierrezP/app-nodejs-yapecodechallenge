import { TransactionType } from '../entities';
import { IGenericRepository } from './generic.repository.interface';

export const TRANSACTION_TYPE_REPOSITORY = 'TRANSACTION_TYPE_REPOSITORY';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITransactionTypeRepository
  extends IGenericRepository<TransactionType> {}
