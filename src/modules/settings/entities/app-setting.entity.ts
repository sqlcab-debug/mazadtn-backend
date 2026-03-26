import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'app_settings', schema: 'mazadtn' })
export class AppSetting {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
}
