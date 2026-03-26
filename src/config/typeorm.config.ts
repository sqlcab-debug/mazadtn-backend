import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from '../modules/categories/entities/category.entity';
import { Lot } from '../modules/lots/entities/lot.entity';
import { User } from '../modules/users/entities/user.entity';
import { AppSetting } from '../modules/settings/entities/app-setting.entity';
import { ActivityLog } from '../modules/activity-logs/entities/activity-log.entity';
import { Bid } from '../modules/bids/entities/bid.entity';
import { Sale } from '../modules/sales/entities/sale.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '192.168.55.61',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'mazadtn_user',
  password: process.env.DB_PASSWORD || '!!Mo97678514@@',
  database: process.env.DB_NAME || 'mazadtn',
  schema: process.env.DB_SCHEMA || 'mazadtn',
  entities: [Category, Lot, User, AppSetting, ActivityLog, Bid, Sale],
  synchronize: false,
  logging: true,
};