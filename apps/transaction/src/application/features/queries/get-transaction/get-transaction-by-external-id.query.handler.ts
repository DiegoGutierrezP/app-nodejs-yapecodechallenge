import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionByExternalIdQuery } from './get-transaction-by-external-id.query copy';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetTransactionDto } from '../../../dtos';
import { Transaction } from 'apps/transaction/src/domain/entities';

@QueryHandler(GetTransactionByExternalIdQuery)
export class GetTransactionByExternalIdQueryHandler
  implements IQueryHandler<GetTransactionByExternalIdQuery>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    query: GetTransactionByExternalIdQuery,
  ): Promise<GetTransactionDto> {
    const transaction = await this.transactionRepository.findByExternalId(
      query.externalId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with external id: ${query.externalId} not found`,
      );
    }

    return this.mapTransactionToDto(transaction);
  }

  private mapTransactionToDto(transaction: Transaction): GetTransactionDto {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType?.name ?? '',
      },
      transactionStatus: {
        name: transaction.status, // si es enum, ya viene como string
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
