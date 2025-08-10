import { Command } from '@nestjs/cqrs';
import { UpdateTransactionDto } from '../../../dtos';

export class UpdateTransactionCommand extends Command<{
  externalId: string;
}> {
  constructor(public readonly request: UpdateTransactionDto) {
    super();
  }
}
