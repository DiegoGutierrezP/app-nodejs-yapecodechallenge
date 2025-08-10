// export type ITransactionRepository = object;

import { Transaction } from '../entities';
import { IGenericRepository } from './generic.repository.interface';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITransactionRepository
  extends IGenericRepository<Transaction> {}
