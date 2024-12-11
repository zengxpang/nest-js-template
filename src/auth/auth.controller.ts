import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ReqUser } from '@/common';

import { JwtSign, Payload } from './auth.interface';
import { AuthService } from './auth.service';
import { JwtVerifyGuard, LocalAuthGuard } from '@/auth/guards';
import { IsPublic } from '@/common';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  /**
   * 用户登陆
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() user: Payload): Promise<Payload> {
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('jwtLogin')
  jwtLogin(@ReqUser() user: Payload): JwtSign {
    return this.authService.jwtSign(user);
  }

  // 只执行verify，不检查accessToken的过期时间。
  @UseGuards(JwtVerifyGuard)
  @Post('jwtRefresh')
  jwtRefresh(
    @ReqUser() user: Payload,
    @Body('refreshToken') refreshToken: string,
  ): JwtSign {
    if (!this.authService.validateRefreshToken(user, refreshToken)) {
      throw new UnauthorizedException('刷新token无效');
    }

    return this.authService.jwtSign(user);
  }
}
