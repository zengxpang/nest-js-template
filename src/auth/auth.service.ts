import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { filter, head, isEmpty, size, split, toLower, map } from 'lodash';
import { ConfigService } from '@nestjs/config';
import * as svgCaptcha from 'svg-captcha';
import { compare } from 'bcrypt';
import { I18nService } from 'nestjs-i18n';

import { I18nTranslations } from '@/generated/i18n.generated';
import { getBaseConfig } from '@/common';
import { RedisService } from '@/redis/redis.service';
import { UserService } from '@/user/user.service';
import { UserInfoEntity } from '@/auth/entities/user-info.entity';

import { LoginEntity } from './entities/login.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '@/email/email.service';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(EmailService)
  private readonly emailService: EmailService;
  @Inject(I18nService)
  i18n: I18nService<I18nTranslations>;

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

  async createRegisterCaptcha(email: string) {
    const result = await this.emailService.sendMail({
      email,
      subject: '注册验证码',
    });
    this.redisService.setEmailCaptcha(email, result?.code);
    return '验证码已发送';
  }

  async register(registerDto: RegisterDto) {
    const { username, password, captcha, email } = registerDto;
    const emailCaptcha = await this.redisService.getEmailCaptcha(email);
    if (!emailCaptcha) {
      throw new BadRequestException(
        this.i18n.t('badRequest.email.captchaInvalid'),
      );
    }

    if (emailCaptcha !== captcha) {
      throw new BadRequestException(
        this.i18n.t('badRequest.email.captchaError'),
      );
    }

    const user = await this.userService.findUser(username);

    if (!isEmpty(user)) {
      throw new BadRequestException(this.i18n.t('badRequest.user.userExist'));
    }

    const emailIsBeUsed = await this.userService.EmailIsBeUsed(email);
    if (emailIsBeUsed) {
      throw new BadRequestException(this.i18n.t('badRequest.user.emailBeUsed'));
    }

    return await this.userService.createDefaultAdminUser({
      username,
      password,
      email,
    });
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const signInErrorsKey = this.redisService.createSignInErrorsKey(
      ip,
      userAgent,
    );
    const signInErrors =
      await this.redisService.getSignInErrors(signInErrorsKey);
    const { signInError } = getBaseConfig(this.configService);
    if (signInErrors >= signInError.limit) {
      const signInErrorsExpire = signInError.expiresIn / 60;
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

    if (isEmpty(user) || !!user.disabled) {
      return false;
    }

    if (isValidatePwd === false) {
      return {
        userId: user.id,
        username: user.username,
      };
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
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
    const {
      jwt: { accessTokenExpiresIn, refreshTokenExpiresIn },
    } = getBaseConfig(this.configService);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
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

  async getUserInfo(useId: string) {
    const userPermissionInfo =
      await this.userService.findUserPermissionInfo(useId);
    if (size(userPermissionInfo) === 0) {
      throw new NotFoundException('用户不存在或账号已被禁用');
    }

    const userPermissionInfoItem = head(userPermissionInfo);
    const userAuthInfo: UserInfoEntity = {
      userId: userPermissionInfoItem.user_id,
      userName: userPermissionInfoItem.username,
      roles: split(userPermissionInfoItem.role_names, ','),
      profile: {
        nickname: userPermissionInfoItem.nickname,
        email: userPermissionInfoItem.email,
        avatar: userPermissionInfoItem.avatar,
        phone: userPermissionInfoItem.phone,
        gender: userPermissionInfoItem.gender,
        birthday: userPermissionInfoItem.birthday,
        description: userPermissionInfoItem.user_description,
      },
      buttons: [],
    };

    if (size(userAuthInfo.roles) === 0) {
      return userAuthInfo;
    }

    userAuthInfo.buttons = map(filter(userPermissionInfo, 'button'), 'button');

    if (!isEmpty(userAuthInfo.buttons)) {
      this.redisService.setUserPermission(useId, userAuthInfo.buttons);
    }

    return userAuthInfo;
  }
}
