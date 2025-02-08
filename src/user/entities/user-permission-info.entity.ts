import { User, Profile, Permission, $Enums } from '@prisma/client';

export class UserPermissionInfoEntity
  implements
    Omit<Permission, 'created_at' | 'updated_at' | 'parent' | 'children'>
{
  /**
   * 用户名
   */
  username: User['username'];

  /**
   * 用户ID
   */
  user_id: User['id'];

  /**
   * 昵称
   */
  nickname: Profile['nickname'];

  /**
   * 头像
   */
  avatar: Profile['avatar'];

  /**
   * 邮箱
   */
  email: Profile['email'];

  /**
   * 电话
   */
  phone: Profile['phone'];

  /**
   * 性别
   */
  gender: $Enums.Gender;

  /**
   * 生日
   */
  birthday: Profile['birthday'];

  /**
   * 描述
   */
  user_description: Profile['description'];

  /**
   * 角色
   */
  role_names: string;

  /**
   *
   */
  name: string;
  id: number;
  pid: number;
  type: $Enums.MenuType;
  button: string;
  path: string;
  component: string;
  title: string;
  i18n_key: string;
  order: number;
  keep_alive: boolean;
  constant: boolean;
  icon: string;
  local_icon: string;
  href: string;
  hide_in_menu: boolean;
  active_menu: string;
  multi_tab: boolean;
  fixed_index_tab: number;
}
