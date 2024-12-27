import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, toLower } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import * as svgCaptcha from 'svg-captcha';

import { getSystemConfig } from '@/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { RedisService } from '@/redis/redis.service';
import { UserService } from '@/user/user.service';
import { RefreshTokenDto } from '@/auth/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(UserService)
  private readonly userService: UserService;

  createCaptcha(ip: string, userAgent: string) {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f0f0f0',
    });
    const captchaKey = this.redisService.createCaptchaKey(ip, userAgent);
    this.redisService.setCaptcha(captchaKey, captcha.text);

    return {
      captcha: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
    };
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const signInErrorsKey = this.redisService.createSignInErrorsKey(
      ip,
      userAgent,
    );
    const signInErrors =
      await this.redisService.getSignInErrors(signInErrorsKey);
    const systemConfig = getSystemConfig(this.configService);
    const signInErrorsLimit = systemConfig.SIGN_IN_ERROR_LIMIT;
    if (signInErrors >= signInErrorsLimit) {
      const signInErrorsExpire = systemConfig.SIGN_IN_ERROR_EXPIRE_IN / 60;
      throw new BadRequestException(
        `登录错误次数过多，请${signInErrorsExpire}分钟后重试`,
      );
    }
    const { username, password, captcha } = loginDto;
    const isCaptchaValid = await this.verifyCaptcha(ip, userAgent, captcha);
    if (!isCaptchaValid) {
      this.redisService.setSignInErrors(signInErrorsKey, signInErrors + 1);
      throw new BadRequestException('验证码错误');
    }
    const payload = await this.validateUser(username, password);
    if (!payload) {
      this.redisService.setSignInErrors(signInErrorsKey, signInErrors + 1);
      throw new BadRequestException('用户名或密码错误, 或账号已被禁用');
    }
    return this.jwtSign(payload);
  }

  async logout(accessToken: string) {
    this.redisService.setBlackList(accessToken);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Auth.IPayload | false> {
    const user = await this.userService.findUser(username);

    if (isEmpty(user) || user.disabled) {
      return false;
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (password !== user.password) {
      return false;
    }

    return {
      userId: user.id,
      username: user.username,
    };
  }

  async verifyCaptcha(ip: string, userAgent: string, captcha: string) {
    const captchaKey = this.redisService.createCaptchaKey(ip, userAgent);
    const captchaInRedis = await this.redisService.getCaptcha(captchaKey);
    if (captchaInRedis && toLower(captchaInRedis) === toLower(captcha)) {
      // await this.redisService.delCaptcha(captchaKey);
      return true;
    }
    return false;
  }

  jwtSign(payload: Auth.IPayload): Auth.IJwtSign {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.getRefreshToken(payload.userId),
    };
  }

  getRefreshToken(userId: string): string {
    const systemConfig = getSystemConfig(this.configService);
    return this.jwtService.sign(
      { userId },
      {
        secret: systemConfig['JWT_REFRESH_SECRET'],
        expiresIn: systemConfig['JWT_REFRESH_TOKEN_EXPIRES_IN'],
      },
    );
  }

  validateRefreshToken(
    payload: Auth.IPayload,
    refreshDto: RefreshTokenDto,
  ): boolean {
    const systemConfig = getSystemConfig(this.configService);
    const { refreshToken } = refreshDto;
    try {
      if (
        !this.jwtService.verify(refreshToken, {
          secret: systemConfig['JWT_REFRESH_SECRET'],
        })
      ) {
        return false;
      }
      const refreshPayload = this.jwtService.decode<{ userId: string }>(
        refreshToken,
      );

      return refreshPayload.userId === payload.userId;
    } catch (e) {
      console.log(e);
    }
  }
}
