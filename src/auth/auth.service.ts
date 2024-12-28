import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, toLower } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import * as svgCaptcha from 'svg-captcha';
import { compare } from 'bcrypt';

import { getSystemConfig } from '@/common';
import { LoginDto, RefreshTokenDto } from '@/auth/dto';
import { RedisService } from '@/redis/redis.service';
import { UserService } from '@/user/user.service';
import { LoginEntity } from '@/auth/entities';

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
    return this.createTokens(payload);
  }

  async logout(accessToken: string) {
    this.redisService.setBlackList(accessToken);
  }

  async validateUser(
    username: string,
    password: string | undefined,
    isValidatePwd = true, // 默认为true,是否需要验证密码
  ): Promise<Auth.IPayload | false> {
    const user = await this.userService.findUser(username);

    if (isEmpty(user) || user.disabled) {
      return false;
    }

    if (isValidatePwd === false) {
      return {
        userId: user.id,
        username: user.username,
      };
    }

    // const isPasswordValid = await compare(password, user.password);

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

  createTokens(payload: Auth.IPayload): Auth.IJwtSign {
    const systemConfig = getSystemConfig(this.configService);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: systemConfig.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: systemConfig.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    accessToken: string,
    refreshDto: RefreshTokenDto,
  ): Promise<LoginEntity> {
    const { refreshToken } = refreshDto;
    const isBlackListed = await this.redisService.isBlackListed(accessToken);
    if (isBlackListed) {
      throw new BadRequestException('请重新登录');
    }
    let payload: Auth.IPayload;

    try {
      const { userId, username } = this.jwtService.verify(refreshToken);
      payload = { userId, username };
    } catch {
      throw new BadRequestException('请重新登录');
    }

    const isValidUser = await this.validateUser(
      payload.username,
      undefined,
      false,
    );
    if (!isValidUser) {
      throw new BadRequestException('用户不存在或账号已被禁用');
    }

    return this.createTokens(payload);
  }
}
