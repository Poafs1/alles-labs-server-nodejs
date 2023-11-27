import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SqlModule } from './sql/sql.module';
import { ConfigsModule } from './configs/configs.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [SqlModule, ConfigsModule, HealthCheckModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
