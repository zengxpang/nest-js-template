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
            SELECT username,
                   GROUP_CONCAT(DISTINCT pe.name) AS permissions
            FROM user u
                     LEFT JOIN user_on_role ur ON u.id = ur.user_id
                     LEFT JOIN role r ON ur.role_id = r.id AND r.deleted = FALSE AND r.disabled = FALSE
                     LEFT JOIN role_on_permission rp ON r.id = rp.role_id
                     LEFT JOIN permission pe ON rp.permission_id = pe.id
            WHERE u.id = ${userId} AND u.deleted = FALSE AND u.disabled = FALSE
            GROUP BY u.username
        )
        SELECT * FROM user_permissions;
    `;

    return split(head(permissions)?.permissions, ',') ?? [];
  }
}
