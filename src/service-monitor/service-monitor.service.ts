import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { find, isArray, map } from 'lodash';

@Injectable()
export class ServiceMonitorService {
  bytesToGB(bytes: number) {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2);
  }

  async getServerMonitorInfo() {
    // 获取操作系统信息
    const osInfo = await si.osInfo();

    // 获取cpu信息
    const cpu = await si.cpu();

    // 获取内存信息
    const mem = await si.mem();

    // 获取网络接口信息
    const networkInterfaces = await si.networkInterfaces();

    // 获取磁盘布局信息
    const diskLayout = await si.diskLayout();
    const fsSize = await si.fsSize();

    const load = await si.currentLoad();

    const userUsage = load.currentLoadUser.toFixed(2) + '%'; // 用户使用率
    const systemUsage = load.currentLoadSystem.toFixed(2) + '%'; // 系统使用率
    const idleUsage = load.currentLoadIdle.toFixed(2) + '%'; // 计算空闲率

    const getIp = () => {
      if (isArray(networkInterfaces)) {
        return find(networkInterfaces, (networkInterface) => {
          return networkInterface.iface === 'en0';
        })?.ip4;
      }
      return networkInterfaces.ip4;
    };

    return {
      cpu: {
        cores: cpu.cores,
        userUsage,
        systemUsage,
        idleUsage,
      },
      osInfo: {
        hostname: osInfo.hostname,
        ip: getIp(),
        platform: osInfo.platform,
        arch: osInfo.arch,
      },
      mem: {
        total: this.bytesToGB(mem.total) + 'GB',
        free: this.bytesToGB(mem.free) + 'GB',
        used: this.bytesToGB(mem.used) + 'GB',
        usedPercent: ((mem.used / mem.total) * 100).toFixed(2) + '%',
      },
      fsSize: map(fsSize, (item) => ({
        ...item,
        diskType: diskLayout[0].type,
      })),
    };
  }
}
