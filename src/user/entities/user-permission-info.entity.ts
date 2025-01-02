import { User, Profile, Permission } from '@prisma/client';

export class UserPermissionInfoEntity {
  /**
   * 用户名
   */
  username: User['username'];

  /**
   * 昵称
   */
  nickname: Profile['nickname'];

  /**
   * 头像
   */
  avatar: Profile['avatar'];

  /**
   * 角色
   */
  role_names: string;

  /**
   * 权限id
   */
  id: Permission['id'];

  /**
   * 父权限id
   */
  pid: Permission['pid'];

  /**
   * 权限名称
   */
  name: Permission['name'];

  /**
   * 权限路径
   */
  path: Permission['path'];

  /**
   * 权限标识
   */
  permission: Permission['permission'];

  /**
   * 权限类型
   */
  type: Permission['type'];

  /**
   * 组件路径
   */
  component: Permission['component'];

  /**
   * 是否缓存
   */
  cache: Permission['cache'];

  /**
   * 是否隐藏
   */
  hidden: Permission['hidden'];

  /**
   * 图标
   */
  icon: Permission['icon'];

  /**
   * 重定向地址
   */
  redirect: Permission['redirect'];

  /**
   * 路由属性
   */
  props: Permission['props'];

  /**
   * 排序
   */
  sort: Permission['sort'];
}
