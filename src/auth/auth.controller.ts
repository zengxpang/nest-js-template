import {
  Body,
  Controller,
  Inject,
  Ip,
  Post,
  Headers,
  Get,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { IsPublic } from '@/common';
import { LoginEntity, CaptchaEntity } from '@/auth/entities';
import { LoginDto, RefreshTokenDto } from '@/auth/dto';

import { AuthService } from './auth.service';

@ApiTags('权限模块')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Get('hello')
  hello() {
    return 'hello';
  }

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
  logout(@Headers('Authorization') accessToken: string) {
    return this.authService.logout(accessToken.split(' ')[1]);
  }

  @ApiOperation({ summary: '刷新token' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: LoginEntity,
  })
  @IsPublic() // accessToken过期后，需要使用refreshToken来刷新token，所以这里设置为公开接口
  @Post('refreshToken')
  refreshToken(
    @Headers('Authorization') accessToken: string,
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<LoginEntity> {
    if (!accessToken) {
      throw new BadRequestException('请求头中必须包含Authorization属性');
    }

    return this.authService.refreshToken(accessToken.split(' ')[1], refreshDto);
  }
}
