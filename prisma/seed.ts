import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roleName = process.env.DEFAULT_ADMIN_ROLE;
  const role = await prisma.role.upsert({
    create: {
      name: roleName,
      description: '默认超级管理员',
    },
    update: {},
    where: {
      name: roleName,
    },
  });

  await prisma.permission.upsert({
    create: {
      name: '系统管理',
      path: 'system',
      type: 'DIRECTORY',
      icon: 'system',
      roleInPermission: {
        create: {
          roleId: role.id,
        },
      },
      children: {
        create: [
          {
            name: '用户管理',
            path: 'user',
            icon: 'user',
            component: '/system/user/index.tsx',
            cache: true,
            roleInPermission: {
              create: {
                roleId: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加用户',
                  type: 'BUTTON',
                  permission: 'system:user:create',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '编辑用户',
                  type: 'BUTTON',
                  permission: 'system:user:edit',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '删除用户',
                  type: 'BUTTON',
                  permission: 'system:user:delete',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: '菜单管理',
            path: 'menu',
            icon: 'menu',
            component: '/system/menu/index.tsx',
            cache: true,
            roleInPermission: {
              create: {
                roleId: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加菜单',
                  type: 'BUTTON',
                  permission: 'system:menu:create',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '编辑菜单',
                  type: 'BUTTON',
                  permission: 'system:menu:edit',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '删除菜单',
                  type: 'BUTTON',
                  permission: 'system:menu:delete',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: '角色管理',
            path: 'role',
            icon: 'role',
            component: '/system/role/index.tsx',
            cache: true,
            roleInPermission: {
              create: {
                roleId: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加角色',
                  type: 'BUTTON',
                  permission: 'system:role:create',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '编辑角色',
                  type: 'BUTTON',
                  permission: 'system:role:edit',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
                {
                  name: '删除角色',
                  type: 'BUTTON',
                  permission: 'system:role:delete',
                  roleInPermission: {
                    create: {
                      roleId: role.id,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    update: {},
    where: {
      name: '系统管理',
    },
  });

  const username = process.env.DEFAULT_ADMIN_USERNAME;
  // 加密密码
  const password = await hash(
    process.env.DEFAULT_ADMIN_PASSWORD,
    +process.env.BCRYPT_SALT_ROUNDS,
  );

  await prisma.user.upsert({
    create: {
      username,
      password,
      profile: {
        create: {
          nickname: '超级管理员',
        },
      },
      roleInUser: {
        create: {
          roleId: role.id,
        },
      },
    },
    update: {},
    where: {
      username,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
