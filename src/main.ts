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

import { AppModule } from './app.module';
import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // http://localhost:3000/static/${filename}
  app.useStaticAssets('public', { prefix: '/static' });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 可以将请求参数转换为对应的类型（隐式转换，就不需要手动使用ParseIntPipe等），每个路径参数和查询参数默认都是字符串类型，所以不需要使用ParseStringPipe等
    }),
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('epros-mermaid')
    .setDescription('epros-mermaid API')
    .setVersion('1.0')
    .build();

  await SwaggerModule.loadPluginMetadata(metadata);
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api', app, document, {
    jsonDocumentUrl: '/api-json',
  });

  await app.listen(
    configService.get<IMermaidPlatformConfig['NEST_SERVER_PORT']>(
      'NEST_SERVER_PORT',
    ),
  );
}
bootstrap();
