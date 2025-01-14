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
      name: 'function',
      path: '/function',
      type: 'DIRECTORY',
      i18n_key: 'route.function',
      component: 'layout.base',
      icon: 'icon-park-outline:all-application',
      order: 6,
      role_in_permission: {
        create: {
          role_id: role.id,
        },
      },
      children: {
        create: [
          {
            name: 'function_event-bus',
            path: 'event-bus',
            component: 'view.function_event-bus',
            i18n_key: 'route.function_event-bus',
            title: 'function_event-bus',
            icon: 'ant-design:send-outlined',
            role_in_permission: {
              create: {
                role_id: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加用户',
                  type: 'BUTTON',
                  button: 'system:user:create',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '编辑用户',
                  type: 'BUTTON',
                  button: 'system:user:edit',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '删除用户',
                  type: 'BUTTON',
                  button: 'system:user:delete',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: 'function_request',
            path: 'request',
            component: 'view.function_request',
            title: 'function_request',
            i18n_key: 'route.function_request',
            icon: 'carbon:network-overlay',
            order: 3,
            role_in_permission: {
              create: {
                role_id: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加菜单',
                  type: 'BUTTON',
                  button: 'system:menu:create',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '编辑菜单',
                  type: 'BUTTON',
                  button: 'system:menu:edit',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '删除菜单',
                  type: 'BUTTON',
                  button: 'system:menu:delete',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: 'function_toggle-auth',
            path: 'toggle-auth',
            component: 'view.function_toggle-auth',
            title: 'function_toggle-auth',
            i18n_key: 'route.function_toggle-auth',
            icon: 'ic:round-construction',
            order: 4,
            role_in_permission: {
              create: {
                role_id: role.id,
              },
            },
            children: {
              create: [
                {
                  name: '添加角色',
                  type: 'BUTTON',
                  button: 'system:role:create',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '编辑角色',
                  type: 'BUTTON',
                  button: 'system:role:edit',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
                    },
                  },
                },
                {
                  name: '删除角色',
                  type: 'BUTTON',
                  button: 'system:role:delete',
                  role_in_permission: {
                    create: {
                      role_id: role.id,
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
      name: 'function',
    },
  });

  const username = process.env.DEFAULT_ADMIN_USERNAME;
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
      role_in_user: {
        create: {
          role_id: role.id,
        },
      },
    },
    update: {},
    where: {
      username,
    },
  });

  const username2 = 'zengxpang';
  const password2 = await hash('123456', +process.env.BCRYPT_SALT_ROUNDS);
  await prisma.user.upsert({
    create: {
      username: username2,
      password: password2,
      profile: {
        create: {
          nickname: '超级管理员2',
        },
      },
      role_in_user: {
        create: {
          role_id: role.id,
        },
      },
    },
    update: {},
    where: {
      username: username2,
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
