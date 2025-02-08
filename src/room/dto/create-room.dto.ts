import { IsNotEmpty, IsPositive } from 'class-validator';
import { Room } from '@prisma/client';

export class CreateRoomDto
  implements
    Pick<Room, 'name' | 'equipment' | 'capacity' | 'description' | 'location'>
{
  /**
   * 会议室名称
   */
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  name: string;

  /**
   * 会议室描述
   */
  @IsNotEmpty({
    message: '会议室描述不能为空',
  })
  description: string;

  /**
   * 会议室容量
   */
  @IsNotEmpty({
    message: '会议室容量不能为空',
  })
  @IsPositive({
    message: '会议室容量必须为正整数',
  })
  capacity: number;

  /**
   * 会议室位置
   */
  @IsNotEmpty({
    message: '会议室位置不能为空',
  })
  location: string;

  /**
   * 会议室设备
   */
  @IsNotEmpty({
    message: '会议室设备不能为空',
  })
  equipment: string;
}
