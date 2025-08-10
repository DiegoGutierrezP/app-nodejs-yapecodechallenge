import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../domain/entities';
import { GenericRepository } from './generic.repository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories';

@Injectable()
export class TransactionRepository
  extends GenericRepository<Transaction>
  implements ITransactionRepository
{
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>,
  ) {
    super(repository);
  }
}
