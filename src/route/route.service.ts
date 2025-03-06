import { Inject, Injectable } from '@nestjs/common';
import { filter, forEach, head, indexOf, isEmpty, map, split } from 'lodash';

import { UserService } from '@/user/user.service';
import { UserPermissionInfoEntity } from '@/user/entities/user-permission-info.entity';

import { MenuRoute } from './dto/route.dto';

@Injectable()
export class RouteService {
  @Inject(UserService)
  private readonly userService: UserService;

  async getUserRoutes(useId: string) {
    const userPermissionInfo =
      await this.userService.findUserPermissionInfo(useId);

    const directoryAndMenuPermissions = filter(
      userPermissionInfo,
      (item) => item.type && item.type !== 'BUTTON',
    );

    return this.getRoutesByRole(directoryAndMenuPermissions);
  }

  getRoutesByRole(directoryAndMenuPermissions: UserPermissionInfoEntity[]) {
    const directoryAndMenuPermission = head(directoryAndMenuPermissions);
    const roleNamesArray = split(directoryAndMenuPermission?.role_names, ',');
    const isAdmin = indexOf(roleNamesArray, 'admin') > -1;
    if (isAdmin) {
      return this.createAdminRouters(directoryAndMenuPermissions);
    } else {
      return this.createUserRouters(directoryAndMenuPermissions);
    }
  }

  async getConstantRoutes() {
    return [
      {
        name: 'home',
        path: '/home',
        component: 'layout.base$view.home',
        meta: {
          title: 'home',
          i18nKey: 'route.home',
          icon: 'mdi:monitor-dashboard',
          order: 1,
          constant: true,
        },
      },
    ];
  }

  async createUserRouters(
    directoryAndMenuPermissions: UserPermissionInfoEntity[],
  ) {
    return {
      home: 'home',
      routes: [
        ...createMenuTree(directoryAndMenuPermissions),
        {
          name: 'meeting',
          path: '/meeting',
          component: 'layout.base',
          meta: {
            title: 'meeting',
            i18nKey: 'route.meeting',
            icon: 'guidance:meeting-room',
            order: 2,
          },
          children: [
            {
              name: 'meeting_room',
              path: 'meeting_room',
              component: 'view.meeting_room',
              meta: {
                i18nKey: 'route.meeting_room',
                icon: 'fluent:device-meeting-room-24-regular',
                order: 1,
                title: 'meeting_room',
              },
            },
            {
              name: 'meeting_my_booking',
              path: 'meeting_my_booking',
              component: 'view.meeting_my_booking',
              meta: {
                i18nKey: 'route.meeting_my_booking',
                icon: 'pajamas:history',
                order: 3,
                title: 'meeting_my_booking',
              },
            },
          ],
        },
        {
          name: 'service-monitor',
          path: '/service-monitor',
          component: 'layout.base$view.service-monitor',
          meta: {
            order: 20,
            title: 'service-monitor',
            i18nKey: 'route.service-monitor',
            icon: 'streamline:online-medical-service-monitor',
          },
        },
      ],
    };
  }

  async createAdminRouters(
    directoryAndMenuPermissions: UserPermissionInfoEntity[],
  ) {
    return {
      home: 'home',
      routes: [
        ...createMenuTree(directoryAndMenuPermissions),
        {
          name: 'meeting',
          path: '/meeting',
          component: 'layout.base',
          meta: {
            title: 'meeting',
            i18nKey: 'route.meeting',
            icon: 'guidance:meeting-room',
            order: 10,
          },
          children: [
            {
              name: 'meeting_room',
              path: 'meeting_room',
              component: 'view.meeting_room',
              meta: {
                i18nKey: 'route.meeting_room',
                icon: 'fluent:device-meeting-room-24-regular',
                order: 1,
                title: 'meeting_room',
              },
            },
            {
              name: 'meeting_booking',
              path: 'meeting_booking',
              component: 'view.meeting_booking',
              meta: {
                i18nKey: 'route.meeting_booking',
                icon: 'tabler:brand-booking',
                order: 2,
                roles: ['admin'],
                title: 'meeting_booking',
              },
            },
            {
              name: 'meeting_my_booking',
              path: 'meeting_my_booking',
              component: 'view.meeting_my_booking',
              meta: {
                i18nKey: 'route.meeting_my_booking',
                icon: 'pajamas:history',
                order: 3,
                title: 'meeting_my_booking',
              },
            },
            {
              name: 'meeting_statistics',
              path: 'meeting_statistics',
              component: 'view.meeting_statistics',
              meta: {
                title: 'meeting_statistics',
                i18nKey: 'route.meeting_statistics',
                icon: 'wpf:statistics',
                order: 4,
                roles: ['admin'],
              },
            },
          ],
        },
        {
          name: 'service-monitor',
          path: '/service-monitor',
          component: 'layout.base$view.service-monitor',
          meta: {
            order: 11,
            title: 'service-monitor',
            i18nKey: 'route.service-monitor',
            icon: 'streamline:online-medical-service-monitor',
          },
        },
      ],
    };
  }
}

const createMenuTree = (
  menus: UserPermissionInfoEntity[],
  pid = null,
): MenuRoute[] => {
  const menuMap = new Map<number, UserPermissionInfoEntity[]>();

  forEach(menus, (menu) => {
    const list = menuMap.get(menu.pid) || [];
    list.push(menu);
    menuMap.set(menu.pid, list);
  });

  const children = menuMap.get(pid) || [];

  children.sort((a, b) => a.order - b.order);

  return map(children, (menu) => ({
    name: menu.name,
    path: menu.path,
    component: menu.component,
    meta: {
      title: menu.title,
      i18nKey: menu.i18n_key,
      order: menu.order,
      keepAlive: !!menu.keep_alive,
      constant: !!menu.constant,
      icon: menu.icon,
      localIcon: menu.local_icon,
      href: menu.href,
      hideInMenu: !!menu.hide_in_menu,
      activeMenu: menu.active_menu,
      multiTab: !!menu.multi_tab,
      fixedIndexTab: menu.fixed_index_tab,
    },
    children: isEmpty(createMenuTree(menus, menu.id))
      ? null
      : createMenuTree(menus, menu.id),
  }));
};
