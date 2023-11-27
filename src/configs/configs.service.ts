import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPGConfig } from './interfaces/pg.config.interface';
import { IServerConfig } from './interfaces/serverConfig.interface';

@Injectable()
export class ConfigsService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV') || 'development';
  }

  get cookieDomain(): string {
    return this.config.get<string>('COOKIE_DOMAIN') || 'localhost';
  }

  get clientUrl(): string {
    return this.config.get<string>('CLIENT_URL') || 'http://localhost:3000';
  }

  get corsUrl(): string {
    return this.config.get<string>('CORS_URL') || 'http://localhost:3000';
  }

  get serverUrl(): string {
    return this.config.get<string>('SERVER_URL') || 'http://localhost:8000';
  }

  get server(): IServerConfig {
    return {
      host: this.config.get<string>('HOST_SERVICE') || 'localhost',
      port: this.config.get<number>('PORT_SERVICE') || 8000,
    };
  }

  get pg(): IPGConfig {
    return {
      host: this.config.get<string>('PG_HOST') || 'localhost',
      port: parseInt(this.config.get<string>('PG_PORT')) || 5432,
      username: this.config.get<string>('PG_USERNAME') || 'postgres',
      password: this.config.get<string>('PG_PASSWORD') || 'postgres',
      database: this.config.get<string>('PG_DATABASE') || 'postgres',
    };
  }
}
