import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly winstonLogger: WinstonLogger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { ip, method, path } = request;
    const userAgent = request.headers['user-agent'];
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    this.winstonLogger.debug(
      `${ip} ${userAgent} ${method} ${path} ${className} ${handlerName} invoked...`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.winstonLogger.debug(
          `${ip} ${userAgent} ${method} ${path} ${response.statusCode} ${Date.now() - now}ms`,
        );
        this.winstonLogger.debug(`response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
