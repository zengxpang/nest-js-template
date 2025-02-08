import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  /**
   *  会议室ID
   */
  @IsNotEmpty({
    message: '会议室ID不能为空',
  })
  id: number;
}
