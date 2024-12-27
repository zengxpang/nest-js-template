import {
  Body,
  Controller,
  Inject,
  Ip,
  Post,
  UnauthorizedException,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { IsPublic } from '@/common';
import { JwtVerifyGuard } from '@/auth/guards';
import { LoginEntity, CaptchaEntity } from '@/auth/entities';
import { LoginDto, RefreshTokenDto } from '@/auth/dto';

import { AuthService } from './auth.service';

@ApiTags('权限模块')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @ApiOperation({ summary: '获取验证码' })
  @ApiOkResponse({
    type: CaptchaEntity,
  })
  @IsPublic()
  @Get('createCaptcha')
  getCaptcha(@Ip() ip: string, @Headers('user-agent') userAgent: string) {
    return this.authService.createCaptcha(ip, userAgent);
  }

  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({
    type: LoginEntity,
  })
  // JwtAuthGuard设置为全局守卫了，所以这里需要设置为公开接口
  @IsPublic()
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<LoginEntity> {
    return this.authService.login(loginDto, ip, userAgent);
  }

  @ApiOperation({ summary: '登出' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @Post('logout')
  logout(@Headers('authorization') accessToken: string) {
    return this.authService.logout(accessToken.split(' ')[1]);
  }

  @ApiOperation({ summary: '刷新token' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: LoginEntity,
  })
  @UseGuards(JwtVerifyGuard)
  @Post('refreshToken')
  // 只执行verify，不检查access_token的过期时间
  refreshToken(
    @ReqUser() user: Auth.IPayload,
    @Body() refreshDto: RefreshTokenDto,
  ): Auth.IJwtSign {
    if (!this.authService.validateRefreshToken(user, refreshDto)) {
      throw new UnauthorizedException('刷新token无效');
    }
    return this.authService.jwtSign(user);
  }
}
