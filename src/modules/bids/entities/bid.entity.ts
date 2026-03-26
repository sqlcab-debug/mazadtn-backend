import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'bids', schema: 'mazadtn' })
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'lot_id' })
  lotId: string;

  @Column({ type: 'uuid', name: 'bidder_user_id' })
  bidderUserId: string;

  @Column({ type: 'numeric', precision: 18, scale: 3 })
  amount: string;

  @Column({ type: 'varchar', length: 255, name: 'user_email', nullable: true })
  userEmail?: string | null;

  @Column({ type: 'varchar', length: 255, name: 'user_name', nullable: true })
  userName?: string | null;

  @Column({ type: 'boolean', name: 'is_proxy', default: false })
  isProxy: boolean;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'max_proxy_amount', nullable: true })
  maxProxyAmount?: string | null;

  @Column({ type: 'varchar', length: 30, default: 'winning' })
  status: string;

  @Column({ type: 'timestamp', name: 'bid_time', nullable: true })
  bidTime?: Date | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}