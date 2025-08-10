import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from '../../domain/entities';
import { GenericRepository } from './generic.repository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ITransactionStatusRepository } from '../../domain/repositories';

@Injectable()
export class TransactionStatusRepository
  extends GenericRepository<TransactionStatus>
  implements ITransactionStatusRepository
{
  constructor(
    @InjectRepository(TransactionStatus)
    repository: Repository<TransactionStatus>,
  ) {
    super(repository);
  }
}
