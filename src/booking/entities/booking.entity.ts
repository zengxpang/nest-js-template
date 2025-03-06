import { ApiProperty } from '@nestjs/swagger';
import { Booking, Room, User } from '@prisma/client';

export class BookingEntity implements Booking {
  /**
   * 预定ID
   */
  id: Booking['id'];

  /**
   * 预定开始时间
   */
  start_time: Booking['start_time'];

  /**
   * 预定结束时间
   */
  end_time: Booking['end_time'];

  /**
   * 预定备注
   */
  note: Booking['note'];

  /**
   * 预定状态
   */
  status: Booking['status'];

  /**
   * 创建时间
   */
  created_at: Booking['created_at'];

  /**
   * 更新时间
   */
  updated_at: Booking['updated_at'];

  /**
   * 用户ID
   */
  user_id: Booking['user_id'];

  /**
   * 会议室ID
   */
  room_id: Booking['room_id'];

  /**
   * 用户
   */
  @ApiProperty({ type: () => Object }) // 暂时代替下  @ApiProperty({ type: () => UserEntity })
  user: User;

  /**
   * 会议室
   */
  @ApiProperty({ type: () => Object }) // 暂时代替下  @ApiProperty({ type: () => RoomEntity })
  room: Room;
}
