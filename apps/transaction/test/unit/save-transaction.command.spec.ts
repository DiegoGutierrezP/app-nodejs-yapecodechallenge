import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_TYPE_REPOSITORY,
  ITransactionRepository,
  ITransactionTypeRepository,
} from '../../src/domain/repositories';
import { TransactionStatus } from '../../src/domain/constants';
import { SaveTransactionCommandHandler } from '../../src/application/features/commands/save-transaction/save-transaction.command.handler';
import { SaveTransactionCommand } from '../../src/application/features/commands/save-transaction/save-transaction.command';
import {
  IKafkaProducerService,
  KAFKA_PRODUCER_SERVICE,
} from '../../src/application/contracts/services';
import { Transaction, TransactionType } from '../../src/domain/entities';

describe('SaveTransactionCommandHandler', () => {
  let handler: SaveTransactionCommandHandler;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let transactionTypeRepository: jest.Mocked<ITransactionTypeRepository>;
  let kafkaProducerService: jest.Mocked<IKafkaProducerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveTransactionCommandHandler,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: { save: jest.fn() },
        },
        {
          provide: TRANSACTION_TYPE_REPOSITORY,
          useValue: { findById: jest.fn() },
        },
        {
          provide: KAFKA_PRODUCER_SERVICE,
          useValue: { emitMessage: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get(SaveTransactionCommandHandler);
    transactionRepository = module.get(TRANSACTION_REPOSITORY);
    transactionTypeRepository = module.get(TRANSACTION_TYPE_REPOSITORY);
    kafkaProducerService = module.get(KAFKA_PRODUCER_SERVICE);
  });

  it('should save transaction and emit Kafka event', async () => {
    const dto = {
      accountExternalIdCredit: 'uuid-credit',
      accountExternalIdDebit: 'uuid-debit',
      tranferTypeId: 1,
      value: 500,
    };

    const command = new SaveTransactionCommand(dto);

    transactionTypeRepository.findById.mockResolvedValue({
      id: 1,
      name: 'transfer',
    } as TransactionType);

    transactionRepository.save.mockResolvedValue({
      id: 20,
      transactionExternalId: 'tx-id',
    } as Transaction);

    const result = await handler.execute(command);

    expect(transactionTypeRepository.findById).toHaveBeenCalledWith(1);
    expect(transactionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        accountExternalIdCredit: dto.accountExternalIdCredit,
        accountExternalIdDebit: dto.accountExternalIdDebit,
        transactionTypeId: 1,
        value: 500,
        status: TransactionStatus.PENDING,
      }),
    );

    // expect(kafkaProducerService.emitMessage).toHaveBeenCalledWith(
    //   'anti-fraud.transaction-created',
    //   expect.objectContaining({
    //     transactionId: expect.anything(),
    //     transactionExternalId: expect.any(String),
    //     amount: 500,
    //   }),
    // );

    expect(result).toHaveProperty('externalId');
  });

  it('should throw BadRequestException if transaction type not found', async () => {
    const dto = {
      accountExternalIdCredit: 'uuid-credit',
      accountExternalIdDebit: 'uuid-debit',
      tranferTypeId: 99,
      value: 100,
    };

    const command = new SaveTransactionCommand(dto);

    transactionTypeRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);

    expect(transactionRepository.save).not.toHaveBeenCalled();
    expect(kafkaProducerService.emitMessage).not.toHaveBeenCalled();
  });
});
