import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { Request, Response } from 'express';

import { FormatResponseEntity } from '@/common';

@Injectable()
export class FormatResponseInterceptor<T> implements NestInterceptor {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly winstonLogger: WinstonLogger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data instanceof Error) {
          throw data;
        }

        if (data instanceof StreamableFile || Buffer.isBuffer(data)) {
          return data;
        }

        const result: FormatResponseEntity<T> = {
          code: 200,
          data: data ?? null,
          msg: 'success',
        };

        // 调用记录日志方法
        // this.addLogger(request, result);

        return result;
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  addLogger(request: Request, result: FormatResponseEntity<T>) {
    const { method, originalUrl, body, query, params, ip } = request;
    this.winstonLogger.info('response', {
      request: {
        method,
        originalUrl,
        body,
        query,
        params,
        ip,
      },
      response: result,
    });
  }
}
