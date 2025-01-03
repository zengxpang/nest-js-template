import { IsNotEmpty, Matches } from 'class-validator';

export class PasswordDto {
  /**
   * 原密码
   */
  @Matches(/^\w{6,18}$/, {
    message: '密码格式错误',
  })
  @IsNotEmpty({ message: '原密码不能为空' })
  oldPassword: string;

  /**
   * 新密码
   */
  @Matches(/^\w{6,18}$/, {
    message: '密码格式错误',
  })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
