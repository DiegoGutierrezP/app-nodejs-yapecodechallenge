import { Command } from '@nestjs/cqrs';
import { SaveTransactionDto } from '../../../dtos';

export class SaveTransactionCommand extends Command<{
  externalId: string;
}> {
  constructor(public readonly request: SaveTransactionDto) {
    super();
  }
}
