import { Permission } from '@prisma/client';

export class PermissionEntity
  implements Omit<Permission, 'deleted' | 'update_at' | 'create_at'>
{
  button: string;
  title: string;
  i18n_key: string;
  order: number;
  keep_alive: boolean;
  constant: boolean;
  local_icon: string;
  href: string;
  hide_in_menu: boolean;
  active_menu: string;
  multi_tab: boolean;
  fixed_index_tab: number;
  created_at: Date;
  updated_at: Date;
  /**
   * 权限id
   */
  id: number;

  /**
   * 权限类型
   */
  type: Permission['type'];

  /**
   * 权限名称
   */
  name: string;

  /**
   * 权限标识
   */
  permission: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 权限路径
   */
  path: string;

  /**
   * 组件路径
   */
  component: string;

  /**
   * 排序
   */
  sort: number;

  /**
   * 重定向地址
   */
  redirect: string;

  /**
   * 是否禁用
   */
  disabled: boolean;

  /**
   * 是否隐藏
   */
  hidden: boolean = false;

  /**
   * 是否缓存
   */
  cache: boolean = false;

  /**
   * 路由属性
   */
  props: boolean = false;

  /**
   * 创建时间(UTC)
   */
  createdAt: string;

  /**
   * 更新时间(UTC)
   */
  updatedAt: string;

  /**
   * 父权限id
   */
  pid: number;
}
