import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class FormatResponseEntity<T = unknown> {
  // statusCode?: HttpStatus = 200;
  //
  // data?: T;
  //
  // message?: string = 'success';

  @ApiProperty({ default: 200 })
  statusCode: HttpStatus;

  @ApiProperty()
  data?: T;

  @ApiProperty({ default: 'Success' })
  message: string;
}

export class NullResponseEntity implements FormatResponseEntity<string> {
  // statusCode?: HttpStatus = 200;
  //
  // data?: string = null;
  //
  // message?: string = 'success';

  @ApiProperty({ default: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ default: null })
  data?: string;

  @ApiProperty({ default: 'Success' })
  message: string;
}
