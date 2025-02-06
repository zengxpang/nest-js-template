import { Controller, Get } from '@nestjs/common';
import { ServiceMonitorService } from './service-monitor.service';
import { IsPublic } from '@/common';

@Controller('service-monitor')
export class ServiceMonitorController {
  constructor(private readonly serviceMonitorService: ServiceMonitorService) {}

  @IsPublic()
  @Get('getServerMonitorInfo')
  getServerMonitorInfo() {
    return this.serviceMonitorService.getServerMonitorInfo();
  }
}
