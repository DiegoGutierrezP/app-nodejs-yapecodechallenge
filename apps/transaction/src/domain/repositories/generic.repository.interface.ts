import { DeepPartial } from 'typeorm';

export interface IGenericRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: DeepPartial<T>): Promise<T>;
  update(id: number, data: DeepPartial<T>): Promise<void>;
  save(entity: DeepPartial<T>): Promise<T>;
}
