import { TransactionStatus } from '../../domain/constants';

export class UpdateTransactionDto {
  transactionId: number;
  status: TransactionStatus;
}
