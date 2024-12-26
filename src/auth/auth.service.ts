import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { isEmpty } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';

import { getSystemConfig } from '@/common';

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

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (password !== user.password) {
      throw new BadRequestException('密码错误');
    }

    return omit(user, ['password']);
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

  validateRefreshToken(payload: Auth.IPayload, refreshToken: string): boolean {
    const systemConfig = getSystemConfig(this.configService);
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
