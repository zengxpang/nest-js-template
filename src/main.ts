import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { getSystemConfig } from '@/common';

import { AppModule } from './app.module';
import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const systemConfig = getSystemConfig(configService);

  // 全局前缀
  app.setGlobalPrefix(systemConfig.NEST_PREFIX);

  // static静态服务
  // http://localhost:3000/static/${filename}
  app.useStaticAssets('public', { prefix: '/static' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 可以将请求参数转换为对应的类型（隐式转换，就不需要手动使用ParseIntPipe等），每个路径参数和查询参数默认都是字符串类型，所以不需要使用ParseStringPipe等
    }),
  );

  // winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // swagger
  const title = systemConfig.SWAGGER_TITLE;
  const description = systemConfig.SWAGGER_DESCRIPTION;
  const version = systemConfig.SWAGGER_VERSION;
  const swaggerConfig = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();

  await SwaggerModule.loadPluginMetadata(metadata);
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('/api', app, document, {
    jsonDocumentUrl: '/api-json',
  });

  // nest
  await app.listen(systemConfig.NEST_PORT);
}
bootstrap();
