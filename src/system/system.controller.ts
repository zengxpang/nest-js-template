import {
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';

import { SystemService } from './system.service';
import { RoleListDto } from './dto/role-list.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserListDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /**
   * 增加用户
   * @param createUserDto
   */
  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.systemService.createUser(createUserDto);
  }

  /**
   * 删除用户
   * @param ids
   */
  @Delete('deleteUsers')
  deleteUsers(
    @Query(
      'ids',
      new ParseArrayPipe({
        separator: ',',
      }),
    )
    ids: string[],
  ) {
    return this.systemService.deleteUsers(ids);
  }

  /**
   * 更新用户
   * @param updateUserDto
   */
  @Post('updateUser')
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.systemService.updateUser(updateUserDto);
  }

  /**
   * 获取用户列表
   * @param userListDto
   */
  @Post('getUserList')
  getUserList(@Body() userListDto: UserListDto) {
    return this.systemService.getUserList(userListDto);
  }

  @Get('findUser')
  findUser(@Query('id') id: string) {
    return this.systemService.findUser(id);
  }

  /**
   * 增加角色
   * @param createRoleDto
   */
  @Post('createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.systemService.createRole(createRoleDto);
  }

  /**
   * 删除角色
   * @param ids
   */
  @Delete('deleteRoles')
  deleteRoles(
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
        separator: ',',
      }),
    )
    ids: number[],
  ) {
    return this.systemService.deleteRoles(ids);
  }

  /**
   * 更新角色
   * @param updateRoleDto
   */
  @Post('updateRole')
  updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.systemService.updateRole(updateRoleDto);
  }

  /**
   * 获取角色列表
   * @param roleListDto
   */
  @Post('getRoleList')
  getRoleList(@Body() roleListDto: RoleListDto) {
    return this.systemService.getRoleList(roleListDto);
  }

  /**
   * 获取菜单列表
   */
  @Get('getMenuList')
  getMenuList() {
    return this.systemService.getMenuList();
  }

  /**
   * 获取所有的角色
   */
  @Get('getAllRoles')
  getAllRoles() {
    return this.systemService.getAllRoles();
  }
}
