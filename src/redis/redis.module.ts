import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule as BaseRedisModule } from '@nestjs-modules/ioredis';

import { getBaseConfig } from '@/common';

import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    BaseRedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const {
          redis: { url },
        } = getBaseConfig(configService);
        return {
          type: 'single',
          url,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
