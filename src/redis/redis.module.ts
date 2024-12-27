import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as BaseRedisModule } from '@nestjs-modules/ioredis';

import { getSystemConfig } from '@/common';

import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    BaseRedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: getSystemConfig(configService).REDIS_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
