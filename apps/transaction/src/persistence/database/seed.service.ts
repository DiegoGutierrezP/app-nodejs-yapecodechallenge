import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionType } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async seed() {
    const defaultTypes = ['Yape', 'Deposito', 'Transferencia', 'Retiro'];

    for (const name of defaultTypes) {
      const exists = await this.transactionTypeRepository.findOne({
        where: { name },
      });
      if (!exists) {
        await this.transactionTypeRepository.save(
          this.transactionTypeRepository.create({ name }),
        );
      }
    }
  }
}
