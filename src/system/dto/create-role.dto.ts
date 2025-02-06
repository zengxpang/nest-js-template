import { Role } from '@prisma/client';

export class CreateRoleDto
  implements Pick<Role, 'name' | 'deleted' | 'disabled'>
{
  /**
   * 角色名称
   */
  name: Role['name'];

  /**
   * 角色描述
   */
  description?: Role['description'];

  /**
   * 是否删除
   */
  deleted: Role['deleted'];

  /**
   * 是否禁用
   */
  disabled: Role['disabled'];
}
