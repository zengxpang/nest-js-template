import { Room } from '@prisma/client';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class RoomListDto
  implements
    Partial<
      Pick<
        Room,
        | 'name'
        | 'capacity'
        | 'location'
        | 'equipment'
        | 'description'
        | 'is_booked'
      >
    >
{
  /**
   * 页码
   */
  @IsNotEmpty({
    message: '页码不能为空',
  })
  @IsPositive({
    message: '页码必须为正整数',
  })
  pageNum: number;

  /**
   * 每页数量
   */
  @IsNotEmpty({
    message: '每页数量不能为空',
  })
  @IsPositive({
    message: '每页数量必须为正整数',
  })
  pageSize: number;

  /**
   * 会议室名称
   */
  name?: Room['name'];

  /**
   * 会议室容纳人数
   */
  capacity?: Room['capacity'];

  /**
   * 会议室位置
   */
  location?: Room['location'];

  /**
   * 会议室设备
   */
  equipment?: Room['equipment'];

  /**
   * 会议室是否被预定
   */
  is_booked?: Room['is_booked'];

  /**
   * 会议室描述
   */
  description?: Room['description'];
}
