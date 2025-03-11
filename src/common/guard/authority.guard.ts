import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { some, includes, isEmpty, size } from 'lodash';

import { ConfigService } from '@nestjs/config';
import { AUTHORITY, getBaseConfig } from '@/common';
import { RedisService } from '@/redis/redis.service';
import { PermissionService } from '@/permission/permission.service';

@Injectable()
export class AuthorityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const needPermissions = this.reflector.getAllAndOverride<string[]>(
      AUTHORITY,
      [context.getHandler(), context.getClass()],
    );

    // 不需要任何权限的话
    if (isEmpty(needPermissions)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const { username, userId } = user;

    const {
      builtIn: { defaultAdminUsername },
    } = getBaseConfig(this.configService);
    if (username === defaultAdminUsername) {
      return true;
    }

    const permissions = await this.redisService.getUserPermission(userId);

    if (
      some(permissions, (permission) => includes(needPermissions, permission))
    ) {
      return true;
    }

    const userPermissions =
      await this.permissionService.findPermissions(userId);

    if (size(userPermissions)) {
      this.redisService.setUserPermission(userId, userPermissions);
    }

    return !!some(userPermissions, (permission) =>
      includes(needPermissions, permission),
    );
  }
}
