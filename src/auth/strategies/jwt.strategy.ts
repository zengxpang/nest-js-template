import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from '@/common';

import { JwtPayload, Payload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 路由提供了一个过期的 JWT，请求将被拒绝，并发送一个 401 Unauthorized 响应
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): Payload {
    // 放在 req.user 中
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
