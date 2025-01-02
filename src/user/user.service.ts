import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { UserPermissionInfoEntity } from '@/user/entities/user-permission-info.entity';

@Injectable()
export class UserService {
  @Inject('PrismaService')
  private prismaService: CustomPrismaService<ExtendedPrismaClient>;

  async findUser(username: string) {
    return await this.prismaService.client.user.findUnique({
      where: {
        username,
        deleted: false,
      },
    });
  }

  async findUserPermissionInfo(id: string) {
    return await this.prismaService.client.$queryRaw<
      UserPermissionInfoEntity[]
    >`
        WITH filtered_users AS (
            SELECT u.id, u.username, p.avatar, p.nickname
            FROM users u
                     LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ${id} AND u.deleted = false AND u.disabled = false
        ),
             user_roles AS (
                 SELECT ur.user_id,
                        GROUP_CONCAT(r.name ORDER BY r.name) AS role_names,
                        GROUP_CONCAT(r.id) AS role_ids
                 FROM filtered_users fu
                          LEFT JOIN role_in_user ur ON fu.id = ur.user_id
                          LEFT JOIN roles r ON ur.role_id = r.id
                 WHERE r.disabled = false
                 GROUP BY ur.user_id
             ),
             role_permissions AS (
                 SELECT ur.user_id, p.pid, p.id, p.name, p.path, p.permission, p.type, p.icon,
                        p.component, p.redirect, p.hidden, p.sort, p.cache, p.props
                 FROM user_roles ur
                          JOIN role_in_permission rp ON FIND_IN_SET(rp.role_id, ur.role_ids) > 0
                          JOIN permissions p ON rp.permission_id = p.id AND p.disabled = false
             )
        SELECT fu.username, fu.nickname, fu.avatar, ur.role_names, rp.pid,
               rp.id, rp.name, rp.path, rp.permission, rp.type, rp.icon, rp.component, rp.redirect, rp.hidden,
               rp.sort, rp.cache, rp.props
        FROM filtered_users fu
                 LEFT JOIN user_roles ur ON fu.id = ur.user_id
                 LEFT JOIN role_permissions rp ON fu.id = rp.user_id
        ORDER BY rp.sort DESC;
    `;
  }
}
