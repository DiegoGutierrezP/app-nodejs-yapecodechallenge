import { IsNumber, IsUUID } from 'class-validator';

export class AntiFraudValidateDto {
  @IsNumber()
  transactionId: number;
  @IsUUID()
  transactionExternalId: string;
  @IsNumber()
  amount: number;
}
