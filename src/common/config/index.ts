import { ConfigService } from '@nestjs/config';

interface ISystemConfig {
  NEST_PREFIX: string;
  NEST_PORT: number;

  DEFAULT_ADMIN_USERNAME: string;
  DEFAULT_ADMIN_PASSWORD: string;
  DEFAULT_ADMIN_ROLE: string;
  DEFAULT_ADMIN_PERMISSION: string;

  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;

  WINSTON_LOG_LEVEL: string;
  WINSTON_LOG_DIRNAME: string;
  WINSTON_LOG_MAX_FILES: string;
  WINSTON_LOG_DATE_PATTERN: string;
  WINSTON_LOG_MAX_SIZE: string;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  REDIS_URL: string;

  CAPTCHA_EXPIRES_IN: number;
  SIGN_IN_ERROR_EXPIRE_IN: number;
  SIGN_IN_ERROR_LIMIT: number;

  FALLBACK_LANGUAGE: string;
  // todo
}

export const getSystemConfig = (
  configService: ConfigService,
): Readonly<ISystemConfig> => {
  return {
    NEST_PREFIX: configService.get<string>('NEST_PREFIX') || '/api/v1',
    NEST_PORT: +configService.get<number>('NEST_PORT') || 3000,

    DEFAULT_ADMIN_USERNAME:
      configService.get<string>('DEFAULT_ADMIN_USERNAME') || 'sAdmin',
    DEFAULT_ADMIN_PASSWORD:
      configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'sAdmin',
    DEFAULT_ADMIN_ROLE:
      configService.get<string>('DEFAULT_ADMIN_ROLE') || 'super admin',
    DEFAULT_ADMIN_PERMISSION:
      configService.get<string>('DEFAULT_ADMIN_PERMISSION') || '*:*:*',

    SWAGGER_TITLE: configService.get<string>('SWAGGER_TITLE') || 'NestJS',
    SWAGGER_DESCRIPTION: configService.get<string>('SWAGGER_DESCRIPTION') || '',
    SWAGGER_VERSION: configService.get<string>('SWAGGER_VERSION') || '1.0',

    WINSTON_LOG_LEVEL: configService.get<string>('WINSTON_LOG_LEVEL') || 'info',
    WINSTON_LOG_DIRNAME:
      configService.get<string>('WINSTON_LOG_DIRNAME') || 'logs',
    WINSTON_LOG_MAX_FILES:
      configService.get<string>('WINSTON_LOG_MAX_FILES') || '14d',
    WINSTON_LOG_DATE_PATTERN:
      configService.get<string>('WINSTON_LOG_DATE_PATTERN') || 'YYYY-MM-DD',
    WINSTON_LOG_MAX_SIZE:
      configService.get<string>('WINSTON_LOG_MAX_SIZE') || '20m',

    JWT_ACCESS_SECRET:
      configService.get<string>('JWT_ACCESS_SECRET') || 'access zxp',
    JWT_REFRESH_SECRET:
      configService.get<string>('JWT_REFRESH_SECRET') || 'refresh zxp',
    JWT_ACCESS_TOKEN_EXPIRES_IN:
      +configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') || 1800,
    JWT_REFRESH_TOKEN_EXPIRES_IN:
      configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d',

    REDIS_URL:
      configService.get<string>('REDIS_URL') || 'redis://localhost:6379',

    CAPTCHA_EXPIRES_IN: +configService.get<number>('CAPTCHA_EXPIRES_IN') || 300,
    SIGN_IN_ERROR_EXPIRE_IN:
      +configService.get<number>('SIGN_IN_ERROR_EXPIRE_IN') || 300,
    SIGN_IN_ERROR_LIMIT: +configService.get<number>('SIGN_IN_ERROR_LIMIT') || 5,

    FALLBACK_LANGUAGE: configService.get<string>('FALLBACK_LANGUAGE') || 'zh',
  };
};
