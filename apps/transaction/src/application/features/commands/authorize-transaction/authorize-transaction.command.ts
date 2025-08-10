import { Command } from '@nestjs/cqrs';
import { TransactionStatus } from 'apps/transaction/src/domain/constants';
import { AuthorizeTransactionDto } from '../../../dtos';

export class AuthorizeTransactionCommand extends Command<{
  externalId: string;
  status: TransactionStatus;
}> {
  constructor(public readonly request: AuthorizeTransactionDto) {
    super();
  }
}
