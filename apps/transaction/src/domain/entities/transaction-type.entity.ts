import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transaction_types' })
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
