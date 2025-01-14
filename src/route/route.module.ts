import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
  imports: [UserModule],
})
export class RouteModule {}
