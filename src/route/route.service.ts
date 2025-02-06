import { Inject, Injectable } from '@nestjs/common';
import { filter, forEach, isEmpty, map } from 'lodash';

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

    const x = filter(
      userPermissionInfo,
      (item) => item.type && item.type !== 'BUTTON',
    );

    return {
      home: 'home',
      routes: [
        {
          name: 'home',
          path: '/home',
          component: 'layout.base$view.home',
          meta: {
            title: 'home',
            i18nKey: 'route.home',
            icon: 'mdi:monitor-dashboard',
            order: 1,
          },
        },
        {
          name: 'user-center',
          path: '/user-center',
          component: 'layout.base$view.user-center',
          meta: {
            title: 'user-center',
            i18nKey: 'route.user-center',
            hideInMenu: true,
          },
        },
        ...createMenuTree(x),
        {
          name: 'manage',
          path: '/manage',
          component: 'layout.base',
          meta: {
            title: 'manage',
            i18nKey: 'route.manage',
            icon: 'carbon:cloud-service-management',
            order: 9,
            roles: ['super admin'],
          },
          children: [
            {
              name: 'manage_user',
              path: 'user',
              component: 'view.manage_user',
              meta: {
                i18nKey: 'route.manage_user',
                icon: 'ic:round-manage-accounts',
                order: 1,
                roles: ['super admin'],
                title: 'manage_user',
              },
            },
            {
              name: 'manage_role',
              path: 'role',
              component: 'view.manage_role',
              meta: {
                i18nKey: 'route.manage_role',
                icon: 'carbon:user-role',
                order: 2,
                roles: ['super admin'],
                title: 'manage_role',
              },
            },
            {
              name: 'manage_menu',
              path: 'menu',
              component: 'view.manage_menu',
              meta: {
                i18nKey: 'route.manage_menu',
                icon: 'material-symbols:route',
                keepAlive: true,
                order: 3,
                roles: ['super admin'],
                title: 'manage_menu',
              },
            },
            {
              name: 'manage_user-detail',
              path: 'user-detail/:id',
              component: 'view.manage_user-detail',
              meta: {
                title: 'manage_user-detail',
                i18nKey: 'route.manage_user-detail',
                hideInMenu: true,
                roles: ['super admin'],
                activeMenu: 'manage_user',
              },
            },
          ],
        },
        {
          name: 'service-monitor',
          path: '/service-monitor',
          component: 'layout.base$view.service-monitor',
          meta: {
            order: 10,
            title: 'service-monitor',
            i18nKey: 'route.service-monitor',
            icon: 'streamline:online-medical-service-monitor',
          },
        },
      ],
    };
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

  async createUserRouters() {
    //
  }

  async createAdminRouters() {
    //
  }

  async createSuperAdminRouters() {
    //
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
