import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { AuthorizeTransactionCommand } from './authorize-transaction.command';
import { TransactionStatus } from '../../../../domain/constants/transaction-status.enum';

@CommandHandler(AuthorizeTransactionCommand)
export class AuthorizeTransactionCommandHandler
  implements ICommandHandler<AuthorizeTransactionCommand>
{
  private readonly logger = new Logger(AuthorizeTransactionCommandHandler.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({ request }: AuthorizeTransactionCommand) {
    this.logger.log(
      `Transaction authorization process started: transactionId=${request.transactionId}`,
    );

    const transaction = await this.transactionRepository.findById(
      request.transactionId,
    );

    if (!transaction) {
      this.logger.warn(
        `Transaction not found: transactionId=${request.transactionId}`,
      );
      throw new NotFoundException(
        `Transaction with id ${request.transactionId} not found`,
      );
    }

    transaction.status = request.authorize
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;

    this.logger.log(
      `Transaction authorization : transactionId=${request.transactionId}, status=${transaction.status}`,
    );

    await this.transactionRepository.save(transaction);

    this.logger.log(
      `Transaction updated successfully : transactionId=${request.transactionId}`,
    );

    return {
      externalId: transaction.transactionExternalId,
    };
  }
}
