import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from '../configs/configs.module';
import { ConfigsService } from '../configs/configs.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigsModule],
      useFactory: (configsService: ConfigsService) => {
        return {
          type: 'postgres',
          host: configsService.pg.host,
          port: configsService.pg.port,
          username: configsService.pg.username,
          password: configsService.pg.password,
          database: configsService.pg.database,
          synchronize: configsService.nodeEnv !== 'production',
          migrationsRun: true,
          // logging: configsService.nodeEnv !== 'production',
          logging: false,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigsService],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class SqlModule {}
