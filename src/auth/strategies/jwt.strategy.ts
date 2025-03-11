import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { getBaseConfig, JWT } from '@/common';
import { RedisService } from '@/redis/redis.service';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
  ) {
    const {
      jwt: { accessSecret },
    } = getBaseConfig(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 路由提供了一个过期的 JWT，请求将被拒绝，并发送一个 401 Unauthorized 响应
      ignoreExpiration: false,
      secretOrKey: accessSecret,
      passReqToCallback: true, // 设置为true，validate的第一个参数才是request
    });
  }

  // fromAuthHeaderAsBearerToken 从request的header中提取token,然后从token中取出payload之后会传入validate方法做验证，验证通过后会将payload放入req.user中
  async validate(req: Request, payload: Auth.IPayload): Promise<Auth.IPayload> {
    const token = req.headers.authorization.split(' ')[1];
    const isBlackListed = await this.redisService.isBlackListed(token);
    if (isBlackListed) {
      throw new UnauthorizedException('请重新登录');
    }

    // 防止账号被禁用或者删除之后，还能进行操作
    const isValidUser = await this.authService.validateUser(
      payload.username,
      undefined,
      false,
    );
    if (!isValidUser) {
      throw new UnauthorizedException('用户不存在或账号已被禁用');
    }

    return payload;
  }
}
