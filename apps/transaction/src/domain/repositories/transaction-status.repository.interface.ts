import { TransactionStatus } from '../entities';
import { IGenericRepository } from './generic.repository.interface';

export const TRANSACTION_STATUS_REPOSITORY = 'TRANSACTION_STATUS_REPOSITORY';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITransactionStatusRepository
  extends IGenericRepository<TransactionStatus> {}
