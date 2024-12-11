import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_VERIFY } from '@/common';

import type { JwtPayload, Payload } from '../auth.interface';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, JWT_VERIFY) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 在处理refreshToken时不检查accessToken的过期时间。
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('jwtSecret'),
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
