import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { getSystemConfig } from '@/common';

import { JwtStrategy, JwtVerifyStrategy } from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';

@Global()
@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const systemConfig = getSystemConfig(configService);
        return {
          secret: systemConfig['JWT_ACCESS_SECRET'],
          signOptions: {
            expiresIn: systemConfig['JWT_ACCESS_TOKEN_EXPIRES_IN'],
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtVerifyStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
