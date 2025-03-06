import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { BookingListDto } from './dto/booking-list.dto';
import { ExtendedPrismaClient } from '../prisma/prisma.extension';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  @Inject('PrismaService')
  private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async list(bookingListDto: BookingListDto) {
    const {
      pageNum,
      pageSize,
      start_time,
      end_time,
      note,
      status,
      room_id,
      user_id,
    } = bookingListDto;

    const condition: Share.IKeyValue = {
      status,
    };

    if (user_id) {
      condition.user_id = user_id;
    }

    if (room_id) {
      condition.room_id = room_id;
    }

    if (note) {
      condition.note = {
        contains: note,
      };
    }

    if (start_time) {
      condition.start_time = {
        gte: new Date(start_time),
      };
    }

    if (end_time) {
      condition.end_time = {
        lte: new Date(end_time),
      };
    }

    return await this.prismaService.client.booking
      .paginate({
        where: condition,
        include: {
          user: true,
          room: true,
          booking_attendees: true,
        },
      })
      .withPages({
        limit: pageSize,
        page: pageNum,
      });
  }

  // async create(createBookingDto: CreateBookingDto, email: string) {
  //   const { roomId, bookingStartTime, bookingEndTime, note } = createBookingDto;
  //   const hasBooked = await this.prismaService.client.booking.findFirst({
  //     where: {
  //       startTime: {
  //         lte: new Date(bookingStartTime),
  //       },
  //       endTime: {
  //         gte: new Date(bookingEndTime),
  //       },
  //       room: {
  //         id: roomId,
  //       },
  //     },
  //     include: {
  //       room: true,
  //     },
  //   });
  //
  //   if (hasBooked) {
  //     throw new BadRequestException('该时间段已被预定');
  //   }
  //
  //   return await this.prismaService.client.booking.create({
  //     data: {
  //       startTime: new Date(bookingStartTime),
  //       endTime: new Date(bookingEndTime),
  //       note,
  //       user: {
  //         connect: {
  //           email,
  //         },
  //       },
  //       room: {
  //         connect: {
  //           id: roomId,
  //         },
  //       },
  //     },
  //   });
  // }
  //
  async changeStatus(id: number, status: BookingStatus) {
    return await this.prismaService.client.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
  //
  // async reminders(id: number, processorEmail: string) {
  //   const flag = await this.redisService.get(`booking_reminders_${id}`);
  //   if (flag) {
  //     return '半小时内只能催办一次，请稍后再试';
  //   }
  //   await this.emailService.sendMail({
  //     to: processorEmail,
  //     subject: '预定申请催办提醒',
  //     html: `id为${id}的预定需要您尽快处理`,
  //   });
  //   await this.redisService.set(`booking_reminders_${id}`, 'done', 1800);
  //   return '催办成功';
  // }
}
