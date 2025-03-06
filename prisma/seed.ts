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
      name: 'meeting',
      path: '/meeting',
      type: 'DIRECTORY',
      i18n_key: 'route.meeting',
      component: 'layout.base',
      icon: 'guidance:meeting-room',
      title: 'meeting',
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
            name: 'meeting_room',
            path: 'meeting_room',
            component: 'view.meeting_room',
            i18n_key: 'route.meeting_room',
            title: 'meeting_room',
            icon: 'fluent:device-meeting-room-24-regular',
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
                  name: '添加会议室',
                  type: 'BUTTON',
                  button: 'meeting:room:create',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '编辑会议室',
                  type: 'BUTTON',
                  button: 'meeting:room:edit',
                  roles: {
                    create: {
                      role_id: adminRole.id,
                    },
                  },
                },
                {
                  name: '删除会议室',
                  type: 'BUTTON',
                  button: 'meeting:room:delete',
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
            name: 'meeting_booking',
            path: 'meeting_booking',
            component: 'view.meeting_booking',
            i18n_key: 'route.meeting_booking',
            title: 'meeting_booking',
            icon: 'tabler:brand-booking',
            order: 2,
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
          {
            name: 'meeting_my_booking',
            path: 'meeting_my_booking',
            component: 'view.meeting_my_booking',
            i18n_key: 'route.meeting_my_booking',
            title: 'meeting_my_booking',
            icon: 'pajamas:history',
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
                  name: '添加预定',
                  type: 'BUTTON',
                  button: 'meeting:my_booking:create',
                  roles: {
                    create: {
                      role_id: userRole.id,
                    },
                  },
                },
                {
                  name: '编辑预定',
                  type: 'BUTTON',
                  button: 'meeting:my_booking:edit',
                  roles: {
                    create: {
                      role_id: userRole.id,
                    },
                  },
                },
                {
                  name: '删除预定',
                  type: 'BUTTON',
                  button: 'meeting:my_booking:delete',
                  roles: {
                    create: {
                      role_id: userRole.id,
                    },
                  },
                },
              ],
            },
          },
          {
            name: 'meeting_statistics',
            path: 'meeting_statistics',
            component: 'view.meeting_statistics',
            i18n_key: 'route.meeting_statistics',
            title: 'meeting_statistics',
            icon: 'wpf:statistics',
            order: 4,
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
        ],
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

  // default meeting room
  await prisma.room.createMany({
    data: [
      {
        name: '天狼星厅',
        description: '我是天狼星厅',
        capacity: 10,
        location: '天狼星',
        equipment: '投影仪',
      },
      {
        name: '猎户厅',
        description: '我是猎户厅',
        capacity: 20,
        location: '猎户星',
        equipment: '投影仪',
      },
      {
        name: '北斗厅',
        description: '我是北斗厅',
        capacity: 30,
        location: '北斗星',
        equipment: '投影仪',
      },
      {
        name: '银河厅',
        description: '我是银河厅',
        capacity: 40,
        location: '银河系',
        equipment: '投影仪',
      },
    ],
  });

  // default booking
  await prisma.booking.createMany({
    data: [
      {
        user_id: admin.id,
        room_id: 1,
        start_time: new Date('2025-02-10 08:00:00'),
        end_time: new Date('2025-02-11 09:00:00'),
        note: '我是天狼星厅的预定',
      },
      {
        user_id: admin.id,
        room_id: 2,
        start_time: new Date('2025-02-12  09:00:00'),
        end_time: new Date('2025-02-13 10:00:00'),
        note: '我是猎户厅的预定',
      },
      {
        user_id: user.id,
        room_id: 3,
        start_time: new Date('2025-02-14 09:00:00'),
        end_time: new Date('2025-02-15 10:00:00'),
        note: '我是北斗星的预定',
      },
      {
        user_id: user.id,
        room_id: 4,
        start_time: new Date('2025-02-16 09:00:00'),
        end_time: new Date('2025-02-17 10:00:00'),
        note: '我是银河厅的预定',
      },
    ],
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
