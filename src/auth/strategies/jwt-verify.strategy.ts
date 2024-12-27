import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { getSystemConfig, JWT_VERIFY } from '@/common';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, JWT_VERIFY) {
  constructor(configService: ConfigService) {
    const systemConfig = getSystemConfig(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 在处理refreshToken时不检查accessToken的过期时间。
      ignoreExpiration: true,
      secretOrKey: systemConfig.JWT_REFRESH_SECRET,
    });
  }

  validate(payload: Auth.IPayload): Auth.IPayload {
    return {
      userId: payload.userId,
      username: payload.username,
    };
  }
}
