import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '@/prisma/prisma.extension';

@Injectable()
export class UserService {
  @Inject('PrismaService')
  private prismaService: CustomPrismaService<ExtendedPrismaClient>;

  async findUser(username: string) {
    return await this.prismaService.client.user.findUnique({
      where: {
        username,
        deleted: false,
      },
    });
  }
}
