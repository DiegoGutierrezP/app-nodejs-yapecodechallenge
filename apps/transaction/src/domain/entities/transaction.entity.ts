import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('int', { name: 'transfer_type_id', nullable: false })
  transferTypeId: number;

  @Column('int', { name: 'transaction_status_id', nullable: false })
  transactionStatusId: number;

  @Column('decimal', { name: 'value', nullable: false })
  value: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
