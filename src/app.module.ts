import * as path from 'path';
import * as winston from 'winston';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';

import { CustomExceptionFilter } from './custom-exception.filter';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, '.env')],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'debug',
        transports: [
          new winston.transports.DailyRotateFile({
            level: configService.get('WINSTON_LOG_LEVEL'),
            dirname: configService.get('WINSTON_LOG_DIRNAME'),
            filename: configService.get('WINSTON_LOG_FILENAME'),
            datePattern: configService.get('WINSTON_LOG_DATE_PATTERN'),
            maxSize: configService.get('WINSTON_LOG_MAX_SIZE'),
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    CatModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InvokeRecordInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
