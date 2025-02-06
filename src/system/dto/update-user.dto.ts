import { CreateUserDto } from './create-user.dto';
import { User } from '@prisma/client';
import { OmitType } from '@nestjs/swagger';

export class UpdateUserDto
  extends OmitType(CreateUserDto, ['password'])
  implements Pick<User, 'id'>
{
  /**
   * 用户id
   */
  id: User['id'];
}
