import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  createCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f0f0f0',
    });
    // const key = getCaptchaKey(ip, userAgent);
    // const expiresIn = getSystemConfig(this.configService).CAPTCHA_EXPIRES_IN;
    // this.redis.set(key, captcha.text, 'EX', expiresIn);

    return {
      captcha: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
    };
  }
}
