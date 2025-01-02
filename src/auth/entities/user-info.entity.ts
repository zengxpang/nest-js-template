import { MenuEntity } from './menu.entity';

export class UserInfoEntity {
  /**
   * 昵称
   */
  nickname: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 用户头像
   */
  avatar?: string;

  /**
   * 用户角色
   */
  roles?: string[] = [];

  /**
   * 用户权限
   */
  permissions?: string[] = [];

  /**
   * 用户可访问菜单
   */
  menus?: MenuEntity[] = [];
}
