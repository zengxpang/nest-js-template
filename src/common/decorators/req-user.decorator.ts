import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isEmpty } from 'lodash';

export const ReqUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    if (isEmpty(request.user)) return null;

    return data ? request.user[data] : request.user;
  },
);
