import { Inject, Injectable } from '@nestjs/common';
import { AntiFraudValidateDto } from './dtos';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE') private transactionClient: ClientKafka,
  ) {}

  validate(payload: AntiFraudValidateDto) {
    let authorize = false;
    if (payload.amount > 0 && payload.amount <= 1000) {
      authorize = true;
    }

    this.transactionClient.emit('transaction.authorize', {
      ...payload,
      authorize,
    });
  }
}
