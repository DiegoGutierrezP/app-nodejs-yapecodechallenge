import { Inject, Injectable, Logger } from '@nestjs/common';
import { AntiFraudValidateDto } from '../dtos';
import { ClientKafka } from '@nestjs/microservices';
import { TRANSACTION_SERVICE } from '../config';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  private readonly TRANSACTION_AUTHORIZE_TOPIC = 'transaction.authorize';

  constructor(
    @Inject(TRANSACTION_SERVICE) private transactionClient: ClientKafka,
  ) {}

  validateTransaction(payload: AntiFraudValidateDto) {
    try {
      this.logger.log(
        `Transaction validation started: externalId=${payload.transactionExternalId} `,
      );

      const authorize = this.shouldAuthorize(payload.amount);

      this.logger.log(
        `Transaction ${payload.transactionExternalId}: authorize=${authorize}`,
      );

      this.transactionClient.emit(this.TRANSACTION_AUTHORIZE_TOPIC, {
        ...payload,
        authorize,
      });

      this.logger.log(
        `Kafka event emitted successfully: topic=${this.TRANSACTION_AUTHORIZE_TOPIC}`,
      );
    } catch (error) {
      this.logger.error('Failed to emit authorization event', error);
    }
  }

  private shouldAuthorize(amount: number) {
    return amount > 0 && amount <= 1000;
  }
}
