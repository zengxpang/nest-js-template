import { IsNotEmpty } from 'class-validator';
import { Profile, User } from '@prisma/client';

type UserProfilePick = Pick<User, 'username' | 'deleted' | 'disabled'> &
  Pick<Profile, 'nickname' | 'gender' | 'email' | 'phone' | 'description'>;

export class UserListDto implements UserProfilePick {
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
   * 用户名
   */
  username: User['username'];

  /**
   * 是否删除
   */
  deleted: User['deleted'];

  /**
   * 是否禁用
   */
  disabled: User['disabled'];

  /**
   * 昵称
   */
  nickname: Profile['nickname'];

  /**
   * 性别
   */
  gender: Profile['gender'];

  /**
   * 邮箱
   */
  email: Profile['email'];

  /**
   * 手机号
   */
  phone: Profile['phone'];

  /**
   * 描述
   */
  description: Profile['description'];
}
