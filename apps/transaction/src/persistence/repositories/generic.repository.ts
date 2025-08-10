import { DeepPartial, Repository } from 'typeorm';
import { IGenericRepository } from '../../domain/repositories';

export class GenericRepository<T> implements IGenericRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return await this.repository.save(newEntity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<void> {
    await this.repository.update(id, data as any);
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return await this.repository.save(entity);
  }
}
