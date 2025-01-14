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
}
