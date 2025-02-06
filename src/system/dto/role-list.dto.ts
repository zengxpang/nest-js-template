import { Role } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class RoleListDto
  implements
    Partial<Pick<Role, 'name' | 'description' | 'deleted' | 'disabled'>>
{
  /**
   * 页数
   */
  @IsNotEmpty({
    message: '页数不能为空',
  })
  pageNum: number;

  /**
   * 页码
   */
  @IsNotEmpty({
    message: '页码不能为空',
  })
  pageSize: number;

  /**
   * 角色名称
   */
  name?: Role['name'];

  /**
   * 角色描述
   */
  description?: Role['description'];

  /**
   * 是否禁用
   */
  disabled?: Role['disabled'];

  /**
   * 是否删除
   */
  deleted?: Role['deleted'];
}
