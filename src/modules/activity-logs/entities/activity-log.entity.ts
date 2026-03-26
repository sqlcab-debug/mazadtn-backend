import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'activity_logs', schema: 'mazadtn' })
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  action: string;

  @Column({ type: 'varchar', nullable: true })
  entity: string;

  @Column({ type: 'varchar', name: 'entity_id', nullable: true })
  entityId: string;

  @Column({ type: 'varchar', name: 'user_email', nullable: true })
  userEmail: string;

  @Column({ type: 'varchar', name: 'user_name', nullable: true })
  userName: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}