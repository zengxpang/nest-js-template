import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { isEmpty, map, omit } from 'lodash';

import { ExtendedPrismaClient } from '@/prisma/prisma.extension';
import { RoomListDto } from './dto/room-list.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;

  async list(roomListDto: RoomListDto) {
    const {
      pageNum,
      pageSize,
      is_booked,
      name,
      description,
      capacity,
      location,
      equipment,
    } = roomListDto;

    const conditions: Share.IKeyValue = {
      is_booked,
    };

    if (name) {
      conditions.name = {
        contains: name,
      };
    }

    if (description) {
      conditions.description = {
        contains: description,
      };
    }

    if (capacity) {
      conditions.capacity = capacity;
    }

    if (location) {
      conditions.location = {
        contains: location,
      };
    }

    if (equipment) {
      conditions.equipment = {
        contains: equipment,
      };
    }

    return await this.prismaService.client.room
      .paginate({
        where: conditions,
      })
      .withPages({
        limit: pageSize,
        page: pageNum,
      });
  }

  async create(createRoomDto: CreateRoomDto) {
    const room = await this.prismaService.client.room.findUnique({
      where: {
        name: createRoomDto.name,
      },
    });
    if (!isEmpty(room)) {
      throw new BadRequestException('会议室已存在');
    }
    return await this.prismaService.client.room.create({
      data: createRoomDto,
    });
  }

  async update(updateRoomDto: UpdateRoomDto) {
    return await this.prismaService.client.room.update({
      where: {
        id: updateRoomDto.id,
      },
      data: omit(updateRoomDto, ['id']),
    });
  }

  async findOne(id: number) {
    return await this.prismaService.client.room.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(ids: string[]) {
    await this.prismaService.client.room.deleteMany({
      where: {
        id: {
          in: map(ids, Number),
        },
      },
    });
    return '删除成功';
  }
}
