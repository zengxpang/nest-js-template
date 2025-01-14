import { Controller, Get } from '@nestjs/common';
import { RouteService } from './route.service';
import { ReqUser } from '@/common';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('getUserRoutes')
  getUserRoutes(@ReqUser('userId') userId: string) {
    return this.routeService.getUserRoutes(userId);
  }

  @Get('getConstantRoutes')
  getConstantRoutes(@ReqUser('userId') userId: string) {
    return this.routeService.getConstantRoutes();
  }
}
