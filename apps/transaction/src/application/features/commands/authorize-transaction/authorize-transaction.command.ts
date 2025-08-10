import { Command } from '@nestjs/cqrs';
import { AuthorizeTransactionDto } from '../../../dtos';

export class AuthorizeTransactionCommand extends Command<{
  externalId: string;
}> {
  constructor(public readonly request: AuthorizeTransactionDto) {
    super();
  }
}
