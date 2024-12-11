import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { User } from '@prisma/client';
import { isEmpty } from 'lodash';

import { md5 } from '@/common/utils';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { ConfigService } from '@nestjs/config';

import { JwtPayload, Payload } from './auth.interface';

@Injectable()
export class AuthService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async validateUser(username: string, password: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: {
        username,
      },
    });
    if (isEmpty(user)) {
      throw new BadRequestException('用户不存在');
    }
    // if (md5(password) !== user.password) {
    //   throw new BadRequestException('密码错误');
    // }

    if (password !== user.password) {
      throw new BadRequestException('密码错误');
    }
    return omit(user, ['password']);
  }

  jwtSign(payload: Payload) {
    const jwtPayload: JwtPayload = {
      sub: payload.userId,
      username: payload.username,
      email: payload.email,
    };

    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.getRefreshToken(jwtPayload.sub),
    };
  }

  getRefreshToken(sub: string): string {
    return this.jwtService.sign(
      { sub },
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: '7d',
      },
    );
  }

  validateRefreshToken(payload: Payload, refreshToken: string): boolean {
    if (
      !this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwtRefreshSecret'),
      })
    ) {
      return false;
    }

    const refreshPayload = this.jwtService.decode<{ sub: string }>(
      refreshToken,
    );
    return refreshPayload.sub === payload.userId;
  }
}
