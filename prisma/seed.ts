import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // default admin
  const adminRoleName = process.env.DEFAULT_ADMIN_ROLE;
  const adminRole = await prisma.role.create({
    data: {
      name: adminRoleName,
      description: '默认管理员',
    },
  });

  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const adminPassword = await hash(
    process.env.DEFAULT_ADMIN_PASSWORD,
    +process.env.BCRYPT_SALT_ROUNDS,
  );
  const admin = await prisma.user.create({
    data: {
      username: adminUsername,
      password: adminPassword,
      profile: {
        create: {
          nickname: '管理员',
        },
      },
      roles: {
        create: {
          role_id: adminRole.id,
        },
      },
    },
  });

  // default user
  const userRoleName = process.env.DEFAULT_USER_ROLE;
  const userRole = await prisma.role.create({
    data: {
      name: userRoleName,
      description: '默认普通用户',
    },
  });

  const userUsername = process.env.DEFAULT_USER_USERNAME;
  const userPassword = await hash(
    process.env.DEFAULT_USER_PASSWORD,
    +process.env.BCRYPT_SALT_ROUNDS,
  );
  const user = await prisma.user.create({
    data: {
      username: userUsername,
      password: userPassword,
      profile: {
        create: {
          nickname: '普通用户',
        },
      },
      roles: {
        create: {
          role_id: userRole.id,
        },
      },
    },
  });

  await prisma.permission.create({
    data: {
      name: 'home',
      path: '/home',
      type: 'DIRECTORY',
      i18n_key: 'route.home',
      component: 'layout.base$view.home',
      icon: 'mdi:monitor-dashboard',
      title: 'home',
      order: 1,
      roles: {
        createMany: {
          data: [
            {
              role_id: adminRole.id,
            },
            {
              role_id: userRole.id,
            },
          ],
        },
      },
    },
  });
  await prisma.permission.create({
    data: {
      name: 'user-center',
      path: '/user-center',
      type: 'DIRECTORY',
      i18n_key: 'route.user-center',
      component: 'layout.base$view.user-center',
      icon: 'solar:user-id-broken',
      hide_in_menu: true,
      title: 'user-center',
      roles: {
        createMany: {
          data: [
            {
              role_id: adminRole.id,
            },
            {
              role_id: userRole.id,
            },
          ],
        },
      },
    },
  });
  await prisma.permission.create({
    data: {
      name: 'manage',
      path: '/manage',
      type: 'DIRECTORY',
      i18n_key: 'route.manage',
      component: 'layout.base',
      icon: 'carbon:cloud-service-management',
      title: 'manage',
      order: 10,
      roles: {
        createMany: {
          data: [
            {
              role_id: adminRole.id,
            },
            {
              role_id: userRole.id,
            },
          ],
        },
      },
      children: {
        create: [
          {
            name: 'manage_user',
            path: 'user',
            component: 'view.manage_user',
            i18n_key: 'route.manage_user',
            title: 'manage_user',
            icon: 'ic:round-manage-accounts',
            order: 1,
            roles: {
              createMany: {
                data: [
                  {
                    role_id: adminRole.id,
                  },
                  {
                    role_id: userRole.id,
                  },
                ],
              },
            },
            children: {
              create: [
                {
                  name: '添加用户',
                  type: 'BUTTON',
                  button: 'manage:user:create',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '编辑用户',
                  type: 'BUTTON',
                  button: 'manage:user:edit',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '删除用户',
                  type: 'BUTTON',
                  button: 'manage:user:delete',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: 'manage_role',
            path: 'role',
            component: 'view.manage_role',
            title: 'manage_role',
            i18n_key: 'route.manage_role',
            icon: 'carbon:user-role',
            order: 2,
            roles: {
              createMany: {
                data: [
                  {
                    role_id: adminRole.id,
                  },
                  {
                    role_id: userRole.id,
                  },
                ],
              },
            },
            children: {
              create: [
                {
                  name: '添加角色',
                  type: 'BUTTON',
                  button: 'manage:role:create',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '编辑角色',
                  type: 'BUTTON',
                  button: 'manage:role:edit',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '删除角色',
                  type: 'BUTTON',
                  button: 'manage:role:delete',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: 'manage_menu',
            path: 'menu',
            component: 'view.manage_menu',
            title: 'manage_menu',
            i18n_key: 'route.manage_menu',
            icon: 'material-symbols:route',
            order: 3,
            roles: {
              createMany: {
                data: [
                  {
                    role_id: adminRole.id,
                  },
                  {
                    role_id: userRole.id,
                  },
                ],
              },
            },
            children: {
              create: [
                {
                  name: '添加菜单',
                  type: 'BUTTON',
                  button: 'manage:menu:create',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '编辑菜单',
                  type: 'BUTTON',
                  button: 'manage:menu:edit',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '删除菜单',
                  type: 'BUTTON',
                  button: 'manage:menu:delete',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '新增子菜单',
                  type: 'BUTTON',
                  button: 'manage:menu:create_child',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  await prisma.permission.create({
    data: {
      name: 'service-monitor',
      path: '/service-monitor',
      type: 'DIRECTORY',
      i18n_key: 'route.service-monitor',
      component: 'layout.base$view.service-monitor',
      icon: 'streamline:online-medical-service-monitor',
      title: 'service-monitor',
      order: 11,
      roles: {
        createMany: {
          data: [
            {
              role_id: adminRole.id,
            },
          ],
        },
      },
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
