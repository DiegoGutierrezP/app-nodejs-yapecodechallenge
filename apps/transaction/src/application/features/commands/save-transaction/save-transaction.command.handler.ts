import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { SaveTransactionCommand } from './save-transaction.command';
import { Transaction } from 'apps/transaction/src/domain/entities';
import { TransactionStatus } from 'apps/transaction/src/domain/constants';
import {
  ITransactionRepository,
  ITransactionTypeRepository,
  TRANSACTION_REPOSITORY,
  TRANSACTION_TYPE_REPOSITORY,
} from 'apps/transaction/src/domain/repositories';
import {
  IKafkaProducerService,
  KAFKA_PRODUCER_SERVICE,
} from '../../../contracts/services';

@CommandHandler(SaveTransactionCommand)
export class SaveTransactionCommandHandler
  implements ICommandHandler<SaveTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
    @Inject(KAFKA_PRODUCER_SERVICE)
    private readonly kafkaProducerService: IKafkaProducerService,
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
