import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../constants';
import { TransactionType } from './transaction-type.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { name: 'transaction_external_id', nullable: false })
  transactionExternalId: string;

  @Column('varchar', { name: 'account_external_id_debit', nullable: false })
  accountExternalIdDebit: string;

  @Column('varchar', { name: 'account_external_id_credit', nullable: false })
  accountExternalIdCredit: string;

  @Column('int', { name: 'transaction_type_id', nullable: false })
  transactionTypeId: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('decimal', { name: 'value', nullable: false })
  value: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  // relations

  @ManyToOne(() => TransactionType, (type) => type.transactions, {
    eager: true,
  })
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionType;
}
