import { IsNotEmpty, IsPositive } from 'class-validator';
import { Booking } from '@prisma/client';

export class BookingListDto
  implements
    Partial<
      Pick<
        Booking,
        'start_time' | 'end_time' | 'note' | 'status' | 'room_id' | 'user_id'
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
   * 预定开始时间
   */
  start_time?: Booking['start_time'];

  /**
   * 预定结束时间
   */
  end_time?: Booking['end_time'];

  /**
   * 备注
   */
  note?: Booking['note'];

  /**
   * 预定状态
   */
  status?: Booking['status'];

  /**
   * 预定人ID
   */
  user_id?: Booking['user_id'];

  /**
   * 会议室ID
   */
  room_id?: Booking['room_id'];
}
