import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sales', schema: 'mazadtn' })
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 220, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 180, name: 'seller_name', nullable: true })
  sellerName?: string | null;

  @Column({ type: 'varchar', length: 30, default: 'draft' })
  status: string;

  @Column({ type: 'timestamp', name: 'starts_at', nullable: true })
  startsAt?: Date | null;

  @Column({ type: 'timestamp', name: 'ends_at', nullable: true })
  endsAt?: Date | null;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'deposit_amount', nullable: true })
  depositAmount?: string | null;

  @Column({ type: 'boolean', name: 'is_featured', default: false })
  isFeatured: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}