import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { SellersModule } from './modules/sellers/sellers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LotsModule } from './modules/lots/lots.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BidsModule } from './modules/bids/bids.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    SellersModule,
    CategoriesModule,
    LotsModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    ActivityLogsModule,
    UploadsModule,
    BidsModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
