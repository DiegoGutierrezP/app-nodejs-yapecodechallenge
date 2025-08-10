import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudValidateDto } from './dtos';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('anti-fraud.transaction-created')
  async validateTransaction(@Payload() payload: AntiFraudValidateDto) {
    this.antiFraudService.validateTransaction(payload);
  }
}
