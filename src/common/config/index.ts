import { ConfigService } from '@nestjs/config';

interface ISystemConfig {
  readonly NEST_PREFIX: string;
  readonly NEST_PORT: number;

  readonly DEFAULT_ADMIN_USERNAME: string;
  readonly DEFAULT_ADMIN_PASSWORD: string;
  readonly DEFAULT_ADMIN_ROLE: string;
  readonly DEFAULT_ADMIN_PERMISSION: string;

  readonly SWAGGER_TITLE: string;
  readonly SWAGGER_DESCRIPTION: string;
  readonly SWAGGER_VERSION: string;

  readonly WINSTON_LOG_LEVEL: string;
  readonly WINSTON_LOG_DIRNAME: string;
  readonly WINSTON_LOG_MAX_FILES: string;
  readonly WINSTON_LOG_DATE_PATTERN: string;
  readonly WINSTON_LOG_MAX_SIZE: string;
  // todo
}

export const getSystemConfig = (
  configService: ConfigService,
): ISystemConfig => {
  return {
    NEST_PREFIX: configService.get<string>('NEST_PREFIX') || '/api/v1',
    NEST_PORT: configService.get<number>('NEST_PORT') || 3000,

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
  };
};
