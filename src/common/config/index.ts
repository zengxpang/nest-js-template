import { ConfigService } from '@nestjs/config';

interface IBaseConfig {
  app: {
    prefix: string;
    port: number;
  };
  winston: {
    logLevel: string;
    logDirname: string;
    logMaxFiles: string;
    logDatePattern: string;
    logMaxSize: string;
  };
  nodeMailer: {
    host: string;
    port: number;
    authUser: string;
    authPass: string;
    secure: boolean;
  };
  redis: {
    port: number;
    host: string;
    url: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  builtIn: {
    defaultAdminUsername: string;
    defaultAdminPassword: string;
    defaultAdminRole: string;
    defaultUserUsername: string;
    defaultUserPassword: string;
    defaultUserRole: string;
  };
  swagger: {
    title: string;
    description: string;
    version: string;
  };
  minio: {
    endPoint: string;
    port: number;
    accessKey: string;
    secretKey: string;
  };
  i18n: {
    fallbackLanguage: string;
  };
  captcha: {
    expiresIn: number;
  };

  signInError: {
    limit: number;
    expiresIn: number;
  };
}

export const getBaseConfig = (
  configService: ConfigService,
): Readonly<IBaseConfig> => {
  return {
    app: {
      prefix: configService.get<string>('NEST_PREFIX') || '/api/v1',
      port: +configService.get<number>('NEST_PORT') || 4000,
    },
    winston: {
      logLevel: configService.get<string>('WINSTON_LOG_LEVEL') || 'info',
      logDirname: configService.get<string>('WINSTON_LOG_DIRNAME') || 'logs',
      logMaxFiles: configService.get<string>('WINSTON_LOG_MAX_FILES') || '14d',
      logDatePattern:
        configService.get<string>('WINSTON_LOG_DATE_PATTERN') || 'YYYY-MM-DD',
      logMaxSize: configService.get<string>('WINSTON_LOG_MAX_SIZE') || '20m',
    },
    nodeMailer: {
      host:
        configService.get<string>('NODEMAILER_SERVER_HOST') || 'smtp.qq.com',
      port: +configService.get<number>('NODEMAILER_SERVER_PORT') || 465,
      authUser:
        configService.get<string>('NODEMAILER_SERVER_AUTH_USER') ||
        '2531069259@qq.com',
      authPass:
        configService.get<string>('NODEMAILER_SERVER_AUTH_PASS') ||
        'zdhawcsqzjofdhgj',
      secure: configService.get<boolean>('NODEMAILER_SERVER_SECURE') ?? false,
    },
    redis: {
      port: +configService.get<number>('REDIS_PORT') || 6379,
      host: configService.get<string>('REDIS_HOST') || 'localhost',
      url: configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
    },
    jwt: {
      accessSecret:
        configService.get<string>('JWT_ACCESS_SECRET') || 'access zxp',
      refreshSecret:
        configService.get<string>('JWT_REFRESH_SECRET') || 'refresh zxp',
      accessTokenExpiresIn:
        +configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') || 1800,
      refreshTokenExpiresIn:
        configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d',
    },
    bcrypt: {
      saltRounds: +configService.get<number>('BCRYPT_SALT_ROUNDS') || 10,
    },
    builtIn: {
      defaultAdminUsername:
        configService.get<string>('DEFAULT_ADMIN_USERNAME') || 'admin',
      defaultAdminPassword:
        configService.get<string>('DEFAULT_ADMIN_PASSWORD') || '123456',
      defaultAdminRole:
        configService.get<string>('DEFAULT_ADMIN_ROLE') || 'admin',
      defaultUserUsername:
        configService.get<string>('DEFAULT_USER_USERNAME') || 'user',
      defaultUserPassword:
        configService.get<string>('DEFAULT_USER_PASSWORD') || '123456',
      defaultUserRole: configService.get<string>('DEFAULT_USER_ROLE') || 'user',
    },
    swagger: {
      title: configService.get<string>('SWAGGER_TITLE') || 'NestJS',
      description: configService.get<string>('SWAGGER_DESCRIPTION') || '',
      version: configService.get<string>('SWAGGER_VERSION') || '1.0',
    },
    minio: {
      endPoint: configService.get<string>('MINIO_END_POINT') || 'localhost',
      port: +configService.get<number>('MINIO_PORT') || 9000,
      accessKey:
        configService.get<string>('MINIO_ACCESS_KEY') || '5OpnF8rGg4C31iBk3LKw',
      secretKey:
        configService.get<string>('MINIO_SECRET_KEY') ||
        'fwTGO8jfyaiHqNKGtcnVcA62B6Kwo9dY0eL3dLqs',
    },
    i18n: {
      fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE') || 'zh',
    },
    captcha: {
      expiresIn: +configService.get<number>('CAPTCHA_EXPIRES_IN') || 300,
    },
    signInError: {
      limit: +configService.get<number>('SIGN_IN_ERROR_LIMIT') || 5,
      expiresIn: +configService.get<number>('SIGN_IN_ERROR_EXPIRES_IN') || 300,
    },
  };
};
