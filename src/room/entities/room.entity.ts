export class RoomEntity {
  /**
   * 会议室ID
   */
  id: number;

  /**
   * 会议室名称
   */
  name: string;

  /**
   * 会议室描述
   */
  description: string;

  /**
   * 会议室容量
   */
  capacity: number;

  /**
   * 会议室位置
   */
  location: string;

  /**
   * 会议室设备
   */
  equipment: string;

  /**
   * 会议室是否被预定
   */
  isBooked: boolean;

  /**
   * 会议室创建时间
   */
  createTime: Date;

  /**
   * 会议室更新时间
   */
  updateTime: Date;
}
