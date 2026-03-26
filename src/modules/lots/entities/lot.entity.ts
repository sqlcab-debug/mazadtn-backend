import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lots', schema: 'mazadtn' })
export class Lot {

  @Column({ name: 'seller_id', type: 'uuid', nullable: false })
  sellerId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50, name: 'lot_number', nullable: true })
  lotNumber?: string | null;

  @Column({ type: 'varchar', length: 120, name: 'reference', nullable: true })
  reference?: string | null;

  @Column({ type: 'varchar', length: 250 })
  title: string;

  @Column({ type: 'varchar', length: 260, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 180, name: 'seller_name', nullable: true })
  sellerName?: string | null;

  @Column({ type: 'varchar', length: 120, name: 'location_city', nullable: true })
  locationCity?: string | null;

  @Column({ type: 'varchar', length: 120, name: 'location_governorate', nullable: true })
  locationGovernorate?: string | null;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'starting_price', nullable: true })
  startingPrice?: string | null;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'current_price', nullable: true })
  currentPrice?: string | null;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'bid_increment_amount', nullable: true })
  bidIncrementAmount?: string | null;

  @Column({ type: 'numeric', precision: 18, scale: 3, name: 'reserve_price', nullable: true })
  reservePrice?: string | null;

  @Column({ type: 'numeric', precision: 8, scale: 3, name: 'buyer_fee_percent', nullable: true })
  buyerFeePercent?: string | null;

  @Column({ type: 'boolean', name: 'vat_applicable', default: false })
  vatApplicable: boolean;

  @Column({ type: 'boolean', name: 'auto_bidding_enabled', default: false })
  autoBiddingEnabled: boolean;

  @Column({ type: 'integer', name: 'auto_extend_minutes', nullable: true })
  autoExtendMinutes?: number | null;

  @Column({ type: 'boolean', name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ type: 'varchar', length: 40, default: 'draft' })
  status: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  condition?: string | null;

  @Column({ type: 'timestamp', name: 'starts_at', nullable: true })
  startsAt?: Date | null;

  @Column({ type: 'timestamp', name: 'ends_at', nullable: true })
  endsAt?: Date | null;

  @Column({ type: 'integer', name: 'bid_count', default: 0 })
  bidCount: number;

  @Column({ type: 'integer', name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ type: 'varchar', length: 500, name: 'image_url', nullable: true })
  imageUrl?: string | null;

  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  categoryId?: string | null;

  @Column({ type: 'uuid', name: 'sale_id', nullable: true })
  saleId?: string | null;
}