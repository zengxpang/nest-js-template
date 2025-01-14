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
        ...createMenuTree(x),
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
      // constant: !!menu.constant,
      constant: true,
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
