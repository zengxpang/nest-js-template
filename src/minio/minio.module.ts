import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSystemConfig } from '@/common';

import * as Minio from 'minio';

import { MinioController } from './minio.controller';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory(configService: ConfigService) {
        const systemConfig = getSystemConfig(configService);
        return new Minio.Client({
          endPoint: systemConfig.MINIO_SERVER_ENDPOINT,
          port: systemConfig.MINIO_SERVER_PORT,
          useSSL: false,
          accessKey: systemConfig.MINIO_SERVER_ACCESS_KEY,
          secretKey: systemConfig.MINIO_SERVER_SECRET_KEY,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
