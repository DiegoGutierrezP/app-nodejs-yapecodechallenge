import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction } from 'apps/transaction/src/domain/entities';
import { GetTransactionByExternalIdQuery } from './get-transaction-by-external-id.query';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import { GetTransactionDto } from '../../../dtos';

@QueryHandler(GetTransactionByExternalIdQuery)
export class GetTransactionByExternalIdQueryHandler
  implements IQueryHandler<GetTransactionByExternalIdQuery>
{
  private readonly logger = new Logger(
    GetTransactionByExternalIdQueryHandler.name,
  );

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    query: GetTransactionByExternalIdQuery,
  ): Promise<GetTransactionDto> {
    this.logger.log(
      `Fetching transaction with externalId: ${query.externalId}`,
    );

    const transaction = await this.transactionRepository.findByExternalId(
      query.externalId,
    );

    if (!transaction) {
      this.logger.warn(
        `Transaction with external id ${query.externalId} not found`,
      );
      throw new NotFoundException(
        `Transaction with external id: ${query.externalId} not found`,
      );
    }

    this.logger.log(`Transaction found: ${transaction.transactionExternalId}`);

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
