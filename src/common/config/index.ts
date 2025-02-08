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

  EMAIL_CAPTCHA_EXPIRES_IN: number;

  BCRYPT_SALT_ROUNDS: number;

  NODEMAILER_SERVER_HOST: string;
  NODEMAILER_SERVER_PORT: number;
  NODEMAILER_SERVER_AUTH_USER: string;
  NODEMAILER_SERVER_AUTH_PASS: string;
  NODEMAILER_SERVER_SECURE: boolean;

  MINIO_SERVER_ENDPOINT: string;
  MINIO_SERVER_PORT: number;
  MINIO_SERVER_ACCESS_KEY: string;
  MINIO_SERVER_SECRET_KEY: string;
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

    EMAIL_CAPTCHA_EXPIRES_IN:
      +configService.get<number>('EMAIL_CAPTCHA_EXPIRES_IN') || 300,

    BCRYPT_SALT_ROUNDS: +configService.get<number>('BCRYPT_SALT_ROUNDS') || 10,

    NODEMAILER_SERVER_HOST:
      configService.get<string>('NODEMAILER_SERVER_HOST') || 'smtp.qq.com',
    NODEMAILER_SERVER_PORT:
      +configService.get<number>('NODEMAILER_SERVER_PORT') || 465,
    NODEMAILER_SERVER_AUTH_USER:
      configService.get<string>('NODEMAILER_SERVER_AUTH_USER') ||
      '2531069259@qq.com',
    NODEMAILER_SERVER_AUTH_PASS:
      configService.get<string>('NODEMAILER_SERVER_AUTH_PASS') ||
      'zdhawcsqzjofdhgj',
    NODEMAILER_SERVER_SECURE:
      configService.get<boolean>('NODEMAILER_SERVER_SECURE') || false,

    MINIO_SERVER_ENDPOINT:
      configService.get<string>('MINIO_SERVER_ENDPOINT') || 'localhost',
    MINIO_SERVER_PORT: +configService.get<number>('MINIO_SERVER_PORT') || 9000,
    MINIO_SERVER_ACCESS_KEY:
      configService.get<string>('MINIO_SERVER_ACCESS_KEY') ||
      '5OpnF8rGg4C31iBk3LKw',
    MINIO_SERVER_SECRET_KEY:
      configService.get<string>('MINIO_SERVER_SECRET_KEY') ||
      'fwTGO8jfyaiHqNKGtcnVcA62B6Kwo9dY0eL3dLqs',
  };
};
