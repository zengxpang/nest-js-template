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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authority, IsPublic, ReqUser, ApiFormatResponse } from '@/common';

import { LoginEntity } from './entities/login.entity';
import { CaptchaEntity } from './entities/captcha.entity';
import { UserInfoEntity } from './entities/user-info.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { AuthService } from './auth.service';

@ApiTags('权限模块')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @ApiOperation({ summary: '获取验证码' })
  @ApiFormatResponse(CaptchaEntity)
  @IsPublic()
  @Get('createCaptcha')
  getCaptcha(@Ip() ip: string, @Headers('user-agent') userAgent: string) {
    return this.authService.createCaptcha(ip, userAgent);
  }

  @ApiOperation({ summary: '登录' })
  @ApiFormatResponse(LoginEntity)
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
  @ApiFormatResponse()
  @Authority('user:logout')
  @Post('logout')
  logout(@Headers('Authorization') accessToken: string) {
    return this.authService.logout(accessToken.split(' ')[1]);
  }

  @ApiOperation({ summary: '刷新token' })
  @ApiBearerAuth()
  @ApiFormatResponse(LoginEntity)
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

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth()
  @ApiFormatResponse(UserInfoEntity)
  @Get('userPermissions')
  getUserInfo(@ReqUser('userId') userId: string) {
    return this.authService.getUserInfo(userId);
  }
}
