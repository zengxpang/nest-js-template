import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { map, omit } from 'lodash';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { getBaseConfig } from '@/common';

import { RoleListDto } from './dto/role-list.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserListDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class SystemService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async createUser(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      nickname,
      disabled,
      deleted,
      gender,
      email,
      phone,
      description,
      roles,
    } = createUserDto;
    const {
      bcrypt: { saltRounds },
    } = getBaseConfig(this.configService);
    const newPassword = await hash(password, +saltRounds);

    return await this.prismaService.client.user.create({
      data: {
        username,
        password: newPassword,
        disabled,
        deleted,
        profile: {
          create: {
            nickname,
            gender,
            email,
            phone,
            description,
          },
        },
        roles: {
          create: map(roles, (role_id) => ({
            roles: {
              connect: {
                id: role_id,
              },
            },
          })),
        },
      },
      include: {
        profile: true,
        roles: true,
      },
    });
  }

  async deleteUsers(ids: string[]) {
    // 假删除
    await this.prismaService.client.user.updateMany({
      data: {
        deleted: 1,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
    return '删除成功';
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const {
      id,
      username,
      nickname,
      disabled,
      deleted,
      gender,
      email,
      phone,
      description,
      roles,
      avatar,
    } = updateUserDto;
    return await this.prismaService.client.user.update({
      where: {
        id,
      },
      data: {
        username,
        disabled,
        deleted,
        profile: {
          update: {
            nickname,
            gender,
            email,
            phone,
            description,
            avatar,
          },
        },
        roles: {
          // ole_in_user 的关联关系已经存在，导致无法使用 create 方法来添加新的关联。你需要先删除现有的关联，然后再创建新的关联
          deleteMany: {
            user_id: id,
          },
          create: map(roles, (role_id) => ({
            roles: {
              connect: {
                id: role_id,
              },
            },
          })),
        },
      },
      include: {
        profile: true,
        roles: true,
      },
    });
  }

  async getUserList(userListDto: UserListDto) {
    const {
      pageNum,
      pageSize,
      nickname,
      username,
      gender,
      phone,
      deleted,
      disabled,
      description,
      email,
    } = userListDto;
    const userCondition: Share.IKeyValue = {
      disabled,
      deleted,
    };
    const profileCondition: Share.IKeyValue = {};

    if (username) {
      userCondition.username = {
        contains: username,
      };
    }

    if (nickname) {
      profileCondition.nickname = {
        contains: nickname,
      };
    }
    if (description) {
      profileCondition.description = {
        contains: description,
      };
    }
    if (phone) {
      profileCondition.phone = {
        contains: phone,
      };
    }

    if (email) {
      profileCondition.email = {
        contains: email,
      };
    }

    if (gender) {
      profileCondition.gender = gender;
    }

    const [result, meta] = await this.prismaService.client.user
      .paginate({
        where: {
          ...userCondition,
          profile: profileCondition,
        },
        select: {
          id: true,
          password: false,
          username: true,
          disabled: true,
          deleted: true,
          created_at: true,
          updated_at: true,
          profile: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
              email: true,
              phone: true,
              gender: true,
              birthday: true,
              description: true,
              created_at: false,
              updated_at: false,
            },
          },
          roles: {
            select: {
              roles: true,
            },
          },
        },
      })
      .withPages({
        limit: pageSize,
        page: pageNum,
      });

    const userList = map(result, (item) => {
      return {
        ...omit(item, ['profile', 'roles']),
        ...{ ...omit(item.profile, ['id']), profile_id: item.profile?.id },
        roles: map(item.roles, 'roles'),
      };
    });
    return [userList, meta];
  }

  async getAllUsers() {
    return this.prismaService.client.user.findMany({
      select: {
        id: true,
        password: false,
        username: true,
        disabled: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        profile: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            email: true,
            phone: true,
            gender: true,
            birthday: true,
            description: true,
            created_at: false,
            updated_at: false,
          },
        },
        roles: {
          select: {
            roles: true,
          },
        },
      },
    });
  }

  async findUser(id: string) {
    const result = await this.prismaService.client.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        password: false,
        username: true,
        disabled: true,
        deleted: true,
        created_at: true,
        updated_at: true,
        profile: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            email: true,
            phone: true,
            gender: true,
            birthday: true,
            description: true,
            created_at: false,
            updated_at: false,
          },
        },
        roles: {
          select: {
            roles: true,
          },
        },
      },
    });
    return {
      ...omit(result, ['profile', 'roles']),
      ...{ ...omit(result.profile, ['id']), profile_id: result.profile?.id },
      roles: map(result.roles, 'roles'),
    };
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const { name, description, disabled, deleted } = createRoleDto;

    return await this.prismaService.client.role.create({
      data: {
        name,
        description,
        deleted,
        disabled,
      },
    });
  }

  async deleteRoles(ids: number[]) {
    // 假删除
    await this.prismaService.client.role.updateMany({
      data: {
        deleted: 1,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
    return '删除成功';
  }

  async updateRole(updateRoleDto: UpdateRoleDto) {
    const { id, name, description, disabled, deleted } = updateRoleDto;
    return await this.prismaService.client.role.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        deleted,
        disabled,
      },
    });
  }

  async getRoleList(roleListDto: RoleListDto) {
    const { pageNum, pageSize } = roleListDto;
    const condition: Share.IKeyValue = {};

    if (roleListDto?.name) {
      condition.name = {
        contains: roleListDto.name,
      };
    }

    if (roleListDto?.description) {
      condition.description = {
        contains: roleListDto.description,
      };
    }

    if (roleListDto?.disabled) {
      condition.disabled = roleListDto.disabled;
    }

    if (roleListDto?.deleted) {
      condition.deleted = roleListDto.deleted;
    }

    return await this.prismaService.client.role
      .paginate({
        where: condition,
      })
      .withPages({
        limit: pageSize,
        page: pageNum,
      });
  }

  async getMenuList() {
    const pageNum = 1;
    const pageSize = 20;
    return await this.prismaService.client.permission
      .paginate({
        where: {
          type: 'DIRECTORY',
        },
        include: {
          children: true,
        },
      })
      .withPages({
        limit: pageSize,
        page: pageNum,
      });
  }

  async getAllRoles() {
    return await this.prismaService.client.role.findMany();
  }
}
