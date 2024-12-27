import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomPrismaModule } from 'nestjs-prisma';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import path from 'path';

import { JwtAuthGuard } from '@/auth/guards';
import {
  CustomExceptionFilter,
  FormatResponseInterceptor,
  getSystemConfig,
  InvokeRecordInterceptor,
} from '@/common';

import { EmailModule } from './email/email.module';
import { ExtendedPrismaConfigService } from './prisma/extended-prisma-config.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true, // 环境变量文件更改后需要重启项目才能加载最新的环境变量
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '../.env.production.local'
          : `../.env.${process.env.NODE_ENV || 'development'}`,
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = getSystemConfig(configService);
        const datePattern = config.WINSTON_LOG_DATE_PATTERN;
        const maxSize = config.WINSTON_LOG_MAX_SIZE;
        const maxFiles = config.WINSTON_LOG_MAX_FILES;
        const level = config.WINSTON_LOG_LEVEL;
        const dirname = config.WINSTON_LOG_DIRNAME;

        return {
          levels: winston.config.syslog.levels,
          level,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              // colors: true, 会导致出现乱码
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
            winston.format.errors({ stack: true }),
          ),
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
            new DailyRotateFile({
              dirname: path.join(dirname, level),
              filename: 'application-%DATE%.log',
              datePattern,
              zippedArchive: true,
              maxSize,
              maxFiles,
              level,
            }),
            new DailyRotateFile({
              dirname: path.join(dirname, 'error'),
              filename: 'error-%DATE%.log',
              datePattern,
              zippedArchive: true,
              maxSize,
              maxFiles,
              level: 'error',
            }),
          ],
          exceptionHandlers: [
            new DailyRotateFile({
              dirname: path.join(dirname, 'exceptions'),
              filename: 'exceptions-%DATE%.log',
              datePattern,
              zippedArchive: true,
              maxSize,
              maxFiles,
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      isGlobal: true,
      useClass: ExtendedPrismaConfigService,
    }),
    EmailModule,
    AuthModule,
    UserModule,
    RedisModule,
  ],
  providers: [
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
