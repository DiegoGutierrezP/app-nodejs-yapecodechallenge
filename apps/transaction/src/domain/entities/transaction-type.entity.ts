import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity({ name: 'transaction_types' })
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, name: 'name', nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  // relations

  @OneToMany(() => Transaction, (transaction) => transaction.transactionTypeId)
  transactions: Transaction[];
}
