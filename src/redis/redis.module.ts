import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get<string>('REDIS_SERVER_HOST'),
            port: configService.get<number>('REDIS_SERVER_PORT'),
          },
          database: configService.get<number>('REDIS_SERVER_DB'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
