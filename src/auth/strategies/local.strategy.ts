import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';
import { LOCAL } from '@/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL) {
  // 传递策略选项, 以便 Passport 可以配置策略，并可以选择性的传入options属性
  // 默认情况下，passport-local 策略需要在请求正文中调用 username and password 的属性
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  // 实现 validate() 方法 验证回调
  async validate(username: string, password: string): Promise<Payload> {
    const user = await this.authService.validateUser(username, password);

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
