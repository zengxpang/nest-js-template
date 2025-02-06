import { CreateRoleDto } from './create-role.dto';
import { Role } from '@prisma/client';

export class UpdateRoleDto extends CreateRoleDto implements Pick<Role, 'id'> {
  /**
   * 角色id
   */
  id: Role['id'];
}
