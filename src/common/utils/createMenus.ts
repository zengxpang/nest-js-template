import { forEach, isEmpty } from 'lodash';
import { UserPermissionInfoEntity } from '@/user/entities/user-permission-info.entity';

/**
 * 根据权限生成菜单
 * @param permissions
 */
export const createMenus = (permissions: UserPermissionInfoEntity[]) => {
  const permissionsMap = new Map<
    number,
    UserPermissionInfoEntity & {
      children?: UserPermissionInfoEntity[];
    }
  >();
  const menus: (UserPermissionInfoEntity & {
    children?: UserPermissionInfoEntity[];
  })[] = [];

  forEach(permissions, (permission) => {
    permissionsMap.set(permission.id, permission);
  });

  forEach(permissions, (permission) => {
    if (!permission.pid) {
      menus.push(permission);
      return;
    }
    const parent = permissionsMap.get(permission.pid);
    if (isEmpty(parent)) {
      menus.push(permission);
      return;
    }

    if (!isEmpty(parent?.children)) {
      parent.children.push(permission);
      return;
    }

    parent.children = [permission];
  });

  return menus;
};
