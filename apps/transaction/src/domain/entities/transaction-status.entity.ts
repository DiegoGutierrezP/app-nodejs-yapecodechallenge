import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transaction_status' })
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', length: 50, nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
