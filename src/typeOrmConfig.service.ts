import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get<string>('NODE_ENV');
    if (env == 'test') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('TEST_DATABASE_URL'),
        synchronize: true,
        dropSchema: true,
        autoLoadEntities: true,
      };
    }
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      synchronize: false,
      dropSchema: false,
      autoLoadEntities: true,
    };
  }
}
