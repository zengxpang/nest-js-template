import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from './prisma/prisma.extension';

@Injectable()
export class AppService {
  @Inject('PrismaService')
  private prismaService: CustomPrismaService<ExtendedPrismaClient>;

  getHello(): string {
    return 'Hello World!';
  }

  users() {
    return this.prismaService.client.user.findMany();
  }
}
