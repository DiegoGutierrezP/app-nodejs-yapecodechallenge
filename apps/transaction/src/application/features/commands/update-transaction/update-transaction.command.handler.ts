import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import { Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute({ request }: UpdateTransactionCommand) {
    const transaction = await this.transactionRepository.findById(
      request.transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${request.transactionId} not found`,
      );
    }

    transaction.status = request.status;

    await this.transactionRepository.save(transaction);

    return {
      externalId: transaction.transactionExternalId,
    };
  }
}
