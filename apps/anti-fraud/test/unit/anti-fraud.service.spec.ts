import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { AntiFraudService } from '../../src/services/anti-fraud.service';
import { TRANSACTION_SERVICE } from '../../src/config';
import { AntiFraudValidateDto } from '../../src/dtos';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: TRANSACTION_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
    kafkaClient = module.get<ClientKafka>(TRANSACTION_SERVICE);
  });

  describe('validateTransaction', () => {
    it('should emit authorization true for amount <= 1000', () => {
      const payload: AntiFraudValidateDto = {
        transactionId: 1,
        transactionExternalId: '05e14a0e-9a7b-4832-8bd0-46ce733a357c',
        amount: 500,
      };

      service.validateTransaction(payload);

      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'transaction.authorize',
        expect.objectContaining({
          ...payload,
          authorize: true,
        }),
      );
    });

    it('should emit authorization false for amount > 1000', () => {
      const payload: AntiFraudValidateDto = {
        transactionId: 1,
        transactionExternalId: '05e14a0e-9a7b-4832-8bd0-46ce733a357c',
        amount: 1500,
      };

      service.validateTransaction(payload);

      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'transaction.authorize',
        expect.objectContaining({
          ...payload,
          authorize: false,
        }),
      );
    });

    it('should not authorize zero or negative amounts', () => {
      const payloadZero: AntiFraudValidateDto = {
        transactionId: 1,
        transactionExternalId: '05e14a0e-9a7b-4832-8bd0-46ce733a357c',
        amount: 0,
      };

      service.validateTransaction(payloadZero);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'transaction.authorize',
        expect.objectContaining({ authorize: false }),
      );

      const payloadNegative: AntiFraudValidateDto = {
        transactionId: 1,
        transactionExternalId: '05e14a0e-9a7b-4832-8bd0-46ce733a357c',
        amount: -2,
      };

      service.validateTransaction(payloadNegative);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'transaction.authorize',
        expect.objectContaining({ authorize: false }),
      );
    });

    it('should catch errors and log them', () => {
      jest.spyOn(kafkaClient, 'emit').mockImplementation(() => {
        throw new Error('Kafka error');
      });

      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      const payload: AntiFraudValidateDto = {
        transactionId: 1,
        transactionExternalId: 'uuid-123',
        amount: 500,
      };

      service.validateTransaction(payload);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to emit authorization event',
        expect.any(Error),
      );
    });
  });

  describe('shouldAuthorize', () => {
    it('should return true for amounts between 1 and 1000 inclusive', () => {
      expect(service['shouldAuthorize'](1)).toBe(true);
      expect(service['shouldAuthorize'](1000)).toBe(true);
    });

    it('should return false for amounts less or equal 0 or greater than 1000', () => {
      expect(service['shouldAuthorize'](0)).toBe(false);
      expect(service['shouldAuthorize'](-10)).toBe(false);
      expect(service['shouldAuthorize'](1001)).toBe(false);
    });
  });
});
