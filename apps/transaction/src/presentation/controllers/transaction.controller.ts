import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { SaveTransactionDto } from '../../application/dtos';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SaveTransactionCommand } from '../../application/features/commands/save-transaction/save-transaction.command';
import { GetTransactionByExternalIdQuery } from '../../application/features/queries/get-transaction/get-transaction-by-external-id.query copy';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  saveTransaction(@Body() dto: SaveTransactionDto) {
    return this.commandBus.execute(new SaveTransactionCommand(dto));
  }

  @Get(':externalId')
  getTransaction(@Param('externalId', ParseUUIDPipe) externalId: string) {
    return this.queryBus.execute(
      new GetTransactionByExternalIdQuery(externalId),
    );
  }
}
