import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  ValidationError,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { isArray, isEmpty, join, map } from 'lodash';
import { I18nContext } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';

import { FormatResponseEntity } from '@/common';
import { I18nTranslations } from '@/generated/i18n.generated';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const i18n = I18nContext.current<I18nTranslations>(host);

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const cause = map(
        formatI18nErrors(
          (
            exception as HttpException & {
              errors: ValidationError[];
            }
          )?.errors ?? [],
          i18n.service,
          {
            lang: i18n.lang,
          },
        ),
        (error) => Object.values(error?.constraints),
      );

      message =
        isArray(cause) && !isEmpty(cause)
          ? join(cause[0], ',')
          : exception.message;
      this.handleHttpException(exception, httpStatus);
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      message = exception.message;
      this.handlePrismaException(exception);
    } else if (exception instanceof Error) {
      this.handleGenericError(exception);
    } else {
      this.handleUnknownError(exception);
    }

    const responseBody: FormatResponseEntity = {
      code: httpStatus,
      data: null,
      msg: message,
    };

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  // http异常
  private handleHttpException(exception: HttpException, status: number): void {
    this.logger.error(`HTTP Exception: ${exception.message}`, {
      status,
      stack: exception.stack,
    });
  }

  // prisma异常
  private handlePrismaException(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError,
  ): void {
    if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      this.logger.error(`Prisma Unknown Exception: ${exception.message}`, {
        stack: exception.stack,
      });
      return;
    }

    this.logger.error(`Prisma Exception: ${exception.message}`, {
      code: exception.code,
      meta: exception.meta,
      stack: exception.stack,
    });
  }

  // 已知异常
  private handleGenericError(exception: Error): void {
    this.logger.error(`Unhandled Exception: ${exception.message}`, {
      stack: exception.stack,
    });
  }

  // 未知异常
  private handleUnknownError(exception: unknown): void {
    this.logger.error('Unknown error', { exception });
  }
}
