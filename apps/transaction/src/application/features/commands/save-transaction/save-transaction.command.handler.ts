import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveTransactionCommand } from './save-transaction.command';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  ITransactionTypeRepository,
  TRANSACTION_REPOSITORY,
  TRANSACTION_TYPE_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import * as crypto from 'crypto';
import { Transaction } from 'apps/transaction/src/domain/entities';
import { TransactionStatus } from 'apps/transaction/src/domain/constants';

@CommandHandler(SaveTransactionCommand)
export class SaveTransactionCommandHandler
  implements ICommandHandler<SaveTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
  ) {}

  async execute({ request }: SaveTransactionCommand) {
    const type = await this.transactionTypeRepository.findById(
      request.tranferTypeId,
    );

    if (!type) {
      throw new BadRequestException(
        `Transaction type ${request.tranferTypeId} not found`,
      );
    }

    const externalId = crypto.randomUUID();

    const transaction = new Transaction();
    transaction.transactionExternalId = externalId;
    transaction.accountExternalIdCredit = request.accountExternalIdCredit;
    transaction.accountExternalIdDebit = request.accountExternalIdDebit;
    transaction.transactionTypeId = type.id;
    transaction.value = request.value;
    transaction.status = TransactionStatus.PENDING;

    await this.transactionRepository.save(transaction);

    //TODO: call kafka event

    return {
      externalId,
    };
  }
}
