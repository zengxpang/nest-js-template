import { Profile } from '@prisma/client';

export class UserInfoEntity {
  /**
   * 昵称
   */
  userId: string;

  /**
   * 用户名
   */
  userName: string;

  /**
   * 用户角色
   */
  roles?: string[] = [];

  /**
   * 用户权限
   */
  buttons?: string[] = [];

  /**
   * 用户信息
   */
  profile: {
    /**
     * 昵称
     */
    nickname: Profile['nickname'];

    /**
     * 邮箱
     */
    email: Profile['email'];

    /**
     * 头像
     */
    avatar: Profile['avatar'];

    /**
     * 手机
     */
    phone: Profile['phone'];

    /**
     * 性别
     */
    gender: Profile['phone'];

    /**
     * 生日
     */
    birthday: Profile['birthday'];

    /**
     * 描述
     */
    description: Profile['description'];
  };
}
