import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { IsPublic } from '@/common';
import { JwtVerifyGuard, LocalAuthGuard } from '@/auth/guards';

import { AuthService } from './auth.service';

@ApiTags('权限')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  /**
   * 用户登陆
   */
  @IsPublic() // JwtAuthGuard设置为全局守卫了，所以这里需要设置为公开接口
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@ReqUser() user: Auth.IPayload): Auth.IJwtSign {
    return this.authService.jwtSign(user);
  }

  @IsPublic()
  @UseGuards(JwtVerifyGuard)
  @Post('refreshToken')
  // 只执行verify，不检查access_token的过期时间
  refreshToken(
    @ReqUser() user: Auth.IPayload,
    @Body('refreshToken') refreshToken: string,
  ): Auth.IJwtSign {
    if (!this.authService.validateRefreshToken(user, refreshToken)) {
      throw new UnauthorizedException('刷新token无效');
    }
    return this.authService.jwtSign(user);
  }
}
