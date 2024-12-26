import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  /**
   * 刷新令牌
   */
  @IsString({ message: 'refreshToken 必须是字符串' })
  @IsNotEmpty({ message: 'refreshToken 不能为空' })
  refreshToken: string;
}
