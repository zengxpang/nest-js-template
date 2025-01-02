import { OmitType } from '@nestjs/swagger';
import { PermissionEntity } from '@/permission/entities/permission.entity';

export class MenuEntity extends OmitType(PermissionEntity, [
  'createdAt',
  'updatedAt',
  'disabled',
  'permission',
  'sort',
  'type',
]) {
  /**
   * 子菜单
   */
  children?: MenuEntity[] = [];
}
