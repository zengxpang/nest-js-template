import { Module } from '@nestjs/common';
import { ServiceMonitorService } from './service-monitor.service';
import { ServiceMonitorController } from './service-monitor.controller';

@Module({
  controllers: [ServiceMonitorController],
  providers: [ServiceMonitorService],
})
export class ServiceMonitorModule {}
