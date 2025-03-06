import { Room } from '@prisma/client';

export class RoomEntity implements Room {
  /**
   * 会议室ID
   */
  id: Room['id'];

  /**
   * 会议室名称
   */
  name: Room['name'];

  /**
   * 会议室描述
   */
  description: Room['description'];

  /**
   * 会议室位置
   */
  location: Room['location'];

  /**
   * 会议室设备
   */
  equipment: Room['equipment'];

  /**
   * 会议室容量
   */
  capacity: Room['capacity'];

  /**
   * 会议室是否被预定
   */
  is_booked: Room['is_booked'];

  /**
   * 会议室创建时间
   */
  created_at: Room['created_at'];

  /**
   * 会议室更新时间
   */
  updated_at: Room['updated_at'];
}
