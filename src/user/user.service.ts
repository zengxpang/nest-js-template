import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { UserPermissionInfoEntity } from '@/user/entities/user-permission-info.entity';
import { getBaseConfig } from '@/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { isEmpty } from 'lodash';

@Injectable()
export class UserService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async findUser(username: string) {
    return await this.prismaService.client.user.findUnique({
      where: {
        username,
        deleted: 0,
      },
    });
  }

  async EmailIsBeUsed(email: string) {
    const profile = await this.prismaService.client.profile.findFirst({
      where: {
        email,
      },
    });

    console.log(profile);
    return !isEmpty(profile);
  }

  async createDefaultAdminUser({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) {
    const {
      bcrypt: { saltRounds },
    } = getBaseConfig(this.configService);
    const newPassword = await hash(password, +saltRounds);
    return await this.prismaService.client.user.upsert({
      create: {
        username,
        password: newPassword,
        profile: {
          create: {
            nickname: '管理员',
            email,
          },
        },
        roles: {
          create: {
            role_id: 1,
          },
        },
      },
      update: {},
      where: {
        username,
      },
    });
  }

  async findUserPermissionInfo(id: string) {
    return await this.prismaService.client.$queryRaw<
      UserPermissionInfoEntity[]
    >`
        WITH filtered_users AS (
            SELECT u.id, u.username, p.avatar, p.nickname,p.email,p.phone,p.birthday,p.description,p.gender
            FROM user u
                     LEFT JOIN profile p ON u.id = p.user_id
            WHERE u.id = ${id} AND u.deleted = false AND u.disabled = false
        ),
             user_roles AS (
                 SELECT ur.user_id,
                        GROUP_CONCAT(r.name ORDER BY r.name) AS role_names,
                        GROUP_CONCAT(r.id) AS role_ids
                 FROM filtered_users fu
                          LEFT JOIN user_on_role ur ON fu.id = ur.user_id
                          LEFT JOIN role r ON ur.role_id = r.id
                 WHERE r.disabled = false
                 GROUP BY ur.user_id
             ),
             role_permissions AS (
                 SELECT ur.user_id, p.pid, p.id, p.type, p.button, p.name, p.path, p.component, p.title,
                        p.i18n_key, p.order, p.keep_alive, p.constant, p.icon,p.local_icon,p.href,p.hide_in_menu,p.active_menu,p.multi_tab,p.fixed_index_tab
                 FROM user_roles ur
                          JOIN role_on_permission rp ON FIND_IN_SET(rp.role_id, ur.role_ids) > 0
                          JOIN permission p ON rp.permission_id = p.id
             )
        SELECT fu.id as user_id, fu.username, fu.nickname,fu.gender, fu.avatar,fu.email,fu.phone,fu.birthday,fu.description as user_description, ur.role_names, rp.pid, rp.id, rp.type, rp.button, rp.name, rp.path, rp.component, rp.title,
               rp.i18n_key, rp.order, rp.keep_alive, rp.constant, rp.icon,rp.local_icon,rp.href,rp.hide_in_menu,rp.active_menu,rp.multi_tab,rp.fixed_index_tab
        FROM filtered_users fu
                 LEFT JOIN user_roles ur ON fu.id = ur.user_id
                 LEFT JOIN role_permissions rp ON fu.id = rp.user_id
        ORDER BY rp.order DESC
    `;
  }
}
