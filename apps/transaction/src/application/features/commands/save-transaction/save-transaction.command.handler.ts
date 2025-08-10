import { BadRequestException, Inject, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(SaveTransactionCommandHandler.name);
  private readonly ANTI_FRAUD_TRANSACTION_CREATED_TOPIC =
    'anti-fraud.transaction-created';

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: ITransactionTypeRepository,
    @Inject(KAFKA_PRODUCER_SERVICE)
    private readonly kafkaProducerService: IKafkaProducerService,
  ) {}

  async execute({ request }: SaveTransactionCommand) {
    this.logger.log(`Transaction creation process started`);

    const type = await this.transactionTypeRepository.findById(
      request.tranferTypeId,
    );

    if (!type) {
      this.logger.warn(`Transaction type ${request.tranferTypeId} not found`);
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

    this.logger.log(`Transaction saved with externalId: ${externalId}`);

    // emit kafka event (asynchronous)
    this.kafkaProducerService.emitMessage(
      this.ANTI_FRAUD_TRANSACTION_CREATED_TOPIC,
      {
        transactionId: transaction.id,
        transactionExternalId: transaction.transactionExternalId,
        amount: transaction.value,
      },
    );

    this.logger.log(
      `Kafka event emitted successfully: topic=${this.ANTI_FRAUD_TRANSACTION_CREATED_TOPIC}`,
    );

    return {
      externalId,
    };
  }
}
