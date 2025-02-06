import { Profile, User } from '@prisma/client';
import { IsNotEmpty, IsIn, IsEmail } from 'class-validator';

type UserProfilePick = Pick<User, 'username' | 'deleted' | 'disabled'> &
  Pick<Profile, 'gender' | 'email'>;

export class CreateUserDto implements UserProfilePick {
  /**
   * 用户名
   */
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: User['username'];

  /**
   * 用户密码
   */
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: User['password'];

  /**
   * 是否删除
   */
  @IsNotEmpty({
    message: '删除状态不能为空',
  })
  @IsIn([0, 1], {
    message: '删除状态只能为0或1',
  })
  deleted: User['deleted'];

  /**
   * 是否禁用
   */
  @IsNotEmpty({
    message: '禁用状态不能为空',
  })
  @IsIn([0, 1], {
    message: '禁用状态只能为0或1',
  })
  disabled: User['disabled'];

  /**
   * 昵称
   */
  nickname?: Profile['nickname'];

  /**
   * 性别
   */
  @IsNotEmpty({
    message: '性别不能为空',
  })
  @IsIn(['MA', 'FE', 'OT'], {
    message: '性别只能为"MA"或"FE"或"OT"',
  })
  gender: Profile['gender'];

  /**
   * 邮箱
   */
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  email: Profile['email'];

  /**
   * 电话
   */
  phone?: Profile['phone'];

  /**
   * 描述
   */
  description?: Profile['description'];

  /**
   * 角色ids
   */
  roles: number[];
}
