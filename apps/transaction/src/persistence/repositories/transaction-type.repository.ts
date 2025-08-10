import { InjectRepository } from '@nestjs/typeorm';
import { TransactionType } from '../../domain/entities';
import { GenericRepository } from './generic.repository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ITransactionTypeRepository } from '../../domain/repositories';

@Injectable()
export class TransactionTypeRepository
  extends GenericRepository<TransactionType>
  implements ITransactionTypeRepository
{
  constructor(
    @InjectRepository(TransactionType)
    repository: Repository<TransactionType>,
  ) {
    super(repository);
  }
}
