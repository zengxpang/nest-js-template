import { HttpStatus } from '@nestjs/common';

export class FormatResponseEntity<T = unknown> {
  /**
   * 状态码
   */
  statusCode?: HttpStatus = 200;

  /**
   * 返回数据
   */
  data?: T;

  /**
   * 返回信息
   */
  message?: string = 'success';
}

export class NullResponseEntity extends FormatResponseEntity<null> {
  /**
   * 返回数据
   */
  data?: null;
}
