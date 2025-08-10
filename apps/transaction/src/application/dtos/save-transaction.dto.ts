import { IsNumber, IsUUID } from 'class-validator';

export class SaveTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;
  @IsUUID()
  accountExternalIdCredit: string;
  @IsNumber()
  tranferTypeId: number;
  @IsNumber()
  value: number;
}
