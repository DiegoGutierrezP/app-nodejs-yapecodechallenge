import { Controller } from '@nestjs/common';
import { AntiFraudService } from '../services/anti-fraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudValidateDto } from '../dtos';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('anti-fraud.transaction-created')
  async validateTransaction(@Payload() message: AntiFraudValidateDto) {
    this.antiFraudService.validateTransaction(message);
  }
}
