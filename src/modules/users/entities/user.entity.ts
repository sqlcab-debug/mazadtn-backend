import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity({ name: 'users', schema: 'mazadtn' })
export class User extends AppBaseEntity {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', name: 'first_name', nullable: true })
  firstName?: string | null;

  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  lastName?: string | null;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', name: 'language_code', nullable: true })
  languageCode?: string | null;

  @Column({ type: 'timestamp without time zone', name: 'last_login_at', nullable: true })
  lastLoginAt?: Date | null;

  @Column({ type: 'enum', enumName: 'role' as any, enum: [] as any })
  role: string;

  @Column({ type: 'enum', enumName: 'status' as any, enum: [] as any })
  status: string;
}