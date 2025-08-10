import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  ITransactionRepository,
} from '../../src/domain/repositories';
import { Transaction } from '../../src/domain/entities';
import { TransactionStatus } from '../../src/domain/constants/transaction-status.enum';
import { AuthorizeTransactionCommandHandler } from '../../src/application/features/commands/authorize-transaction/authorize-transaction.command.handler';
import { AuthorizeTransactionCommand } from '../../src/application/features/commands/authorize-transaction/authorize-transaction.command';

describe('AuthorizeTransactionCommandHandler', () => {
  let handler: AuthorizeTransactionCommandHandler;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizeTransactionCommandHandler,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(AuthorizeTransactionCommandHandler);
    transactionRepository = module.get(TRANSACTION_REPOSITORY);
  });

  it('should authorize transaction and update status to APPROVED', async () => {
    const dto = {
      transactionId: 10,
      authorize: true,
    };

    const transaction = {
      id: 10,
      transactionExternalId: 'ext-123',
      status: TransactionStatus.PENDING,
    } as Transaction;

    transactionRepository.findById.mockResolvedValue(transaction);
    transactionRepository.save.mockResolvedValue({
      ...transaction,
      status: TransactionStatus.APPROVED,
    });

    const command = new AuthorizeTransactionCommand(dto);
    const result = await handler.execute(command);

    expect(transactionRepository.findById).toHaveBeenCalledWith(10);
    expect(transactionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 10,
        status: TransactionStatus.APPROVED,
      }),
    );
    expect(result).toEqual({
      externalId: 'ext-123',
      status: TransactionStatus.APPROVED,
    });
  });

  it('should set status to REJECTED when authorize is false', async () => {
    const dto = {
      transactionId: 15,
      authorize: false,
    };

    const transaction = {
      id: 15,
      transactionExternalId: 'ext-456',
      status: TransactionStatus.PENDING,
    } as Transaction;

    transactionRepository.findById.mockResolvedValue(transaction);
    transactionRepository.save.mockResolvedValue({
      ...transaction,
      status: TransactionStatus.REJECTED,
    });

    const command = new AuthorizeTransactionCommand(dto);
    const result = await handler.execute(command);

    expect(transactionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 15,
        status: TransactionStatus.REJECTED,
      }),
    );
    expect(result).toEqual({
      externalId: 'ext-456',
      status: TransactionStatus.REJECTED,
    });
  });

  it('should throw NotFoundException if transaction does not exist', async () => {
    const dto = {
      transactionId: 99,
      authorize: true,
    };

    transactionRepository.findById.mockResolvedValue(null);

    const command = new AuthorizeTransactionCommand(dto);
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);

    expect(transactionRepository.save).not.toHaveBeenCalled();
  });
});
