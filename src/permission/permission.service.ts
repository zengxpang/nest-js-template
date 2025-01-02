import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { head, split } from 'lodash';

@Injectable()
export class PermissionService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;

  async findPermissions(userId: string): Promise<string[]> {
    const permissions = await this.prismaService.client.$queryRaw<
      {
        username: string;
        permissions: string;
      }[]
    >`
        WITH user_permissions AS (
            SELECT
                u.username,
                GROUP_CONCAT(DISTINCT pe.permission) AS permissions
            FROM users u
                     LEFT JOIN role_in_user ur ON u.id = ur.user_id
                     LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted = FALSE AND r.disabled = FALSE
                     LEFT JOIN role_in_permission rp ON r.id = rp.role_id
                     LEFT JOIN permissions pe ON rp.permission_id = pe.id AND pe.deleted = FALSE AND pe.disabled = FALSE
            WHERE u.id = ${userId} AND u.deleted = FALSE AND u.disabled = FALSE
            GROUP BY u.username
        )
        SELECT * FROM user_permissions;
    `;

    return split(head(permissions)?.permissions, ',') ?? [];
  }
}
