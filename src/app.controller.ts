import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('根模块')
@Controller()
export class AppController {
  @Inject()
  private readonly appService: AppService;

  @ApiOperation({ summary: 'hello world' })
  @ApiOkResponse({
    type: String,
    description: 'hello world成功',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
