import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { createHash } from 'crypto';

import { getSystemConfig } from '@/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  @InjectRedis()
  private readonly redis: Redis;
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private createKey({
    ip,
    userAgent,
    prefix,
  }: {
    ip: string;
    userAgent: string;
    prefix: string;
  }) {
    const data = `${ip}:${userAgent}`;
    const key = createHash('sha256').update(data).digest('hex');
    return `${prefix}: ${key}`;
  }

  createCaptchaKey(ip: string, userAgent: string) {
    return this.createKey({ ip, userAgent, prefix: 'captcha' });
  }

  setCaptcha(key: string, value: string, expiresIn?: number) {
    if (expiresIn === undefined) {
      expiresIn = getSystemConfig(this.configService).CAPTCHA_EXPIRES_IN;
    }
    return this.redis.set(key, value, 'EX', expiresIn);
  }

  getCaptcha(key: string) {
    return this.redis.get(key);
  }

  delCaptcha(key: string) {
    return this.redis.del(key);
  }

  createEmailCaptchaKey(email: string) {
    return `email-captcha: ${email}`;
  }

  setEmailCaptcha(email: string, captcha: string) {
    const expiresIn = getSystemConfig(
      this.configService,
    ).EMAIL_CAPTCHA_EXPIRES_IN;
    return this.redis.set(
      this.createEmailCaptchaKey(email),
      captcha,
      'EX',
      expiresIn,
    );
  }

  getEmailCaptcha(email: string) {
    return this.redis.get(this.createEmailCaptchaKey(email));
  }

  delEmailCaptcha(email: string) {
    return this.redis.del(this.createEmailCaptchaKey(email));
  }

  createSignInErrorsKey(ip: string, userAgent: string) {
    return this.createKey({ ip, userAgent, prefix: 'sign-in:errors' });
  }

  setSignInErrors(key: string, value: number) {
    const expiresIn = getSystemConfig(
      this.configService,
    ).SIGN_IN_ERROR_EXPIRE_IN;
    return this.redis.set(key, value, 'EX', expiresIn);
  }

  async getSignInErrors(key: string) {
    const result = (await this.redis.get(key)) || 0;
    return +result;
  }

  delSignInErrors(key: string) {
    return this.redis.del(key);
  }

  createBlackListKey(token: string) {
    return `blacklist: ${token}`;
  }

  setBlackList(token: string) {
    const key = this.createBlackListKey(token);
    const expiresIn = getSystemConfig(
      this.configService,
    ).JWT_ACCESS_TOKEN_EXPIRES_IN;
    this.redis.set(key, 'logout', 'EX', expiresIn);
  }

  async isBlackListed(token: string) {
    const key = this.createBlackListKey(token);
    const has = await this.redis.exists(key);
    return !!has;
  }

  createUserPermissionKey(id: string) {
    return `permission: ${id}`;
  }

  getUserPermission(id: string) {
    const key = this.createUserPermissionKey(id);
    return this.redis.smembers(key);
  }

  setUserPermission(id: string, permissions: string[]) {
    const key = this.createUserPermissionKey(id);
    this.redis.sadd(key, permissions);
    this.redis.expire(
      key,
      getSystemConfig(this.configService).JWT_ACCESS_TOKEN_EXPIRES_IN,
    );
  }

  delUserPermission(id: string) {
    const key = this.createUserPermissionKey(id);
    this.redis.del(key);
  }
}
