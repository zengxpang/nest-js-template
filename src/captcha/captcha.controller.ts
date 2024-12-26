import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CaptchaEntity } from './entities/captcha.entity';
import { CaptchaService } from './captcha.service';
import { IsPublic } from '@/common';

@ApiTags('验证码模块')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @ApiOperation({ summary: '获取验证码' })
  @ApiOkResponse({
    type: CaptchaEntity,
  })
  @IsPublic()
  @Get('createCaptcha')
  getCaptcha() {
    return this.captchaService.createCaptcha();
  }
}
