import { IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  /**
   * 用户名
   */
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  /**
   * 密码
   */
  // @Matches(/^[a-zA-Z](?=.*[.?!&_])(?=.*\d)[a-zA-Z\d.?!&_]{5,15}$/, {
  //   message: '密码格式错误',
  // })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  /**
   * 验证码
   */
  @IsNotEmpty({ message: '验证码不能为空' })
  @Matches(/^[a-zA-Z0-9]{4}$/, { message: '验证码格式错误' })
  captcha: string;
}
