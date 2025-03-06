import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  /**
   * 会议室ID
   */
  @IsNotEmpty({
    message: '会议室ID不能为空',
  })
  roomId: number;

  /**
   * 开始时间
   */
  @IsNotEmpty({
    message: '开始时间不能为空',
  })
  bookingStartTime: string;

  /**
   * 结束时间
   */
  @IsNotEmpty({
    message: '结束时间不能为空',
  })
  bookingEndTime: string;

  /**
   * 备注
   */
  note?: string;
}
