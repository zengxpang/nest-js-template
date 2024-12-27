import { HttpStatus } from '@nestjs/common';

export class FormatResponseEntity<T = unknown> {
  statusCode?: HttpStatus = 200;

  data?: T;

  message?: string = 'success';
}

export class NullResponseEntity implements FormatResponseEntity<string> {
  statusCode?: HttpStatus = 200;

  data?: string = null;

  message?: string = 'success';
}
