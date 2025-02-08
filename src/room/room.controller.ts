import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoomService } from './room.service';
import { RoomListDto } from './dto/room-list.dto';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { IsPublic } from '@/common';

@IsPublic()
@ApiTags('会议室模块')
@Controller('room')
export class RoomController {
  @Inject()
  private readonly roomService: RoomService;

  /**
   * 会议室列表
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RoomEntity,
    isArray: true,
  })
  @Post('/list')
  list(@Body() roomPageRequest: RoomListDto) {
    return this.roomService.list(roomPageRequest);
  }

  /**
   * 创建会议室
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RoomEntity,
  })
  @ApiBadRequestResponse({
    description: '会议室已存在',
  })
  @Post('/create')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  /**
   * 删除会议室
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '删除成功',
  })
  @Delete('delete')
  delete(
    @Query(
      'ids',
      new ParseArrayPipe({
        separator: ',',
      }),
    )
    ids: string[],
  ) {
    return this.roomService.delete(ids);
  }

  /**
   * 更新会议室
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RoomEntity,
  })
  @Post('/update')
  update(@Body() updateRoom: UpdateRoomDto) {
    return this.roomService.update(updateRoom);
  }

  /**
   * 查找会议室
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RoomEntity,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.findOne(id);
  }
}
