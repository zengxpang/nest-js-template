import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import { getSystemConfig, JWT, getBlackListKey } from '@/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(
    configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    const systemConfig = getSystemConfig(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 路由提供了一个过期的 JWT，请求将被拒绝，并发送一个 401 Unauthorized 响应
      ignoreExpiration: false,
      secretOrKey: systemConfig['JWT_ACCESS_SECRET'],
      passReqToCallback: true, // 设置为true，validate的第一个参数才是request
    });
  }

  // fromAuthHeaderAsBearerToken 从request的header中提取token,然后从token中取出payload之后会传入validate方法做验证，验证通过后会将payload放入req.user中
  async validate(req: Request, payload: Auth.IPayload): Promise<Auth.IPayload> {
    // const token = req.headers.authorization.split(' ')[1];
    // const blackListKey = getBlackListKey(token);
    // const isBlackListed = await this.redis.exists(blackListKey);
    //
    // if (isBlackListed) {
    //   throw new UnauthorizedException('token失效');
    // }
    return {
      userId: payload.userId,
      username: payload.username,
    };
  }
}
