import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';
import { JwtAuthGuard, ReqUser } from '@/common';

import { BookingService } from './booking.service';
import { BookingListDto } from './dto/booking-list.dto';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('预定模块')
@Controller('booking')
export class BookingController {
  @Inject()
  private readonly bookingService: BookingService;

  /**
   * 获取预定列表
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: BookingEntity,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/list')
  list(@Body() bookingListDto: BookingListDto) {
    return this.bookingService.list(bookingListDto);
  }

  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   type: BookingEntity,
  // })
  // @ApiBadRequestResponse({
  //   description: '该时间段已被预定',
  // })
  // @UseGuards(JwtAuthGuard)
  // @Post('/create')
  // create(
  //   @Body() createBookingDto: CreateBookingDto,
  //   @ReqUser('email') email: string,
  // ) {
  //   return this.bookingService.create(createBookingDto, email);
  // }

  /**
   * 修改预定状态
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    type: BookingEntity,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/changeStatus')
  changeStatus(
    @Query('id') id: number,
    @Query('status', new DefaultValuePipe('APPLYING')) status: BookingStatus,
  ) {
    return this.bookingService.changeStatus(id, status);
  }

  //
  // /**
  //  * 催办提醒
  //  */
  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   type: String,
  // })
  // @UseGuards(JwtAuthGuard)
  // @Get('/reminders')
  // reminders(
  //   @Query('id') id: number,
  //   @Query('processorEmail') processorEmail: string,
  // ) {
  //   return this.bookingService.reminders(id, processorEmail);
  // }
}
