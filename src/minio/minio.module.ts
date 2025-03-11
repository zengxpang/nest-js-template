import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getBaseConfig } from '@/common';

import * as Minio from 'minio';

import { MinioController } from './minio.controller';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory(configService: ConfigService) {
        const {
          minio: { endPoint, port, accessKey, secretKey },
        } = getBaseConfig(configService);
        return new Minio.Client({
          endPoint,
          port,
          useSSL: false,
          accessKey,
          secretKey,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
