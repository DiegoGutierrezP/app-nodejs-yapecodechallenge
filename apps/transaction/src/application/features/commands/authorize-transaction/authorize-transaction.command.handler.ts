import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import { Inject, NotFoundException } from '@nestjs/common';
import { AuthorizeTransactionCommand } from './authorize-transaction.command';
import { TransactionStatus } from '../../../../domain/constants/transaction-status.enum';

@CommandHandler(AuthorizeTransactionCommand)
export class AuthorizeTransactionCommandHandler
  implements ICommandHandler<AuthorizeTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({ request }: AuthorizeTransactionCommand) {
    const transaction = await this.transactionRepository.findById(
      request.transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${request.transactionId} not found`,
      );
    }

    transaction.status = request.authorize
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;

    await this.transactionRepository.save(transaction);

    return {
      externalId: transaction.transactionExternalId,
    };
  }
}
