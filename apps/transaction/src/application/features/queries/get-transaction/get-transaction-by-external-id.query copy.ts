import { Query } from '@nestjs/cqrs';
import { GetTransactionDto } from '../../../dtos';

export class GetTransactionByExternalIdQuery extends Query<GetTransactionDto> {
  constructor(public readonly externalId: string) {
    super();
  }
}
