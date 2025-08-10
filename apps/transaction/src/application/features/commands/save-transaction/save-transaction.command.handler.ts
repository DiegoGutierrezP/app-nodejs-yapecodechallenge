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
import { KafkaProducerService } from 'apps/transaction/src/infrastructure/kafka/kafka-producer.service';

@CommandHandler(SaveTransactionCommand)
export class SaveTransactionCommandHandler
  implements ICommandHandler<SaveTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
    private readonly kafkaProducerService: KafkaProducerService,
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

    // call kafka event
    this.kafkaProducerService.emitMessage('anti-fraud.validate', {
      transactionId: transaction.id,
      transactionExternalId: transaction.transactionExternalId,
      amount: transaction.value,
    });

    return {
      externalId,
    };
  }
}
