import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

export class RegisterDto {
  /**
   * 用户名
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.username.0'),
  })
  username: string;

  /**
   * 密码
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.password.0'),
  })
  @Matches(/^\w{6,18}$/, {
    // 字符串必须包含 6 到 18 个字母、数字或下划线
    message: i18nValidationMessage<I18nTranslations>('validate.password.1'),
  })
  password: string;

  /**
   * 验证码
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.captcha.0'),
  })
  @Matches(/^[a-zA-Z0-9]{4}$/, {
    message: i18nValidationMessage<I18nTranslations>('validate.captcha.1'),
  })
  captcha: string;

  /**
   * 邮箱
   */
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validate.email.0'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validate.email.1'),
    },
  )
  email: string;
}
