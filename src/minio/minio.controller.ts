import { Controller, Get, Inject, Query } from '@nestjs/common';

import * as Minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private readonly minioClient: Minio.Client;

  @Get('preSignedUrl')
  // 为了不在前端暴露accessKey,accessSecret preSignedPutObject 返回一个预签名 url 给前端。前端用这个 url 来发送 put 请求，来把文件直传 minio。
  preSignedPutObject(@Query('name') name: string) {
    return this.minioClient.presignedPutObject(
      'new-meeting-room-system',
      name,
      3600, // 1 hour
    );
  }
}
