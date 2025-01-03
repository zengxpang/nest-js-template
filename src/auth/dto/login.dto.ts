import { IsNotEmpty, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { I18nTranslations } from '@/generated/i18n.generated';

export class LoginDto {
  /**
   * 用户名
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.login.0'),
  })
  username: string;

  /**
   * 密码
   */
  @Matches(/^\w{6,18}$/, {
    // 字符串必须包含 6 到 18 个字母、数字或下划线
    message: '密码格式错误',
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.login.1'),
  })
  password: string;

  /**
   * 验证码
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.login.2'),
  })
  @Matches(/^[a-zA-Z0-9]{4}$/, { message: '验证码格式错误' })
  captcha: string;
}
