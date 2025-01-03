import { Controller, Get, Inject } from '@nestjs/common';
import { IsPublic } from '@/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from '@/app.service';
import { I18nTranslations } from '@/generated/i18n.generated';

@IsPublic()
@Controller('app')
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;

  @Get('hello')
  async getHello(@I18n() i18n: I18nContext<I18nTranslations>) {
    return i18n.t('test.Hello');
    // return this.appService.getHello();
  }

  @Get('name')
  async getName(@I18n() i18n: I18nContext<I18nTranslations>) {
    // return i18n.t('test.Name', {
    //   args: {
    //     name: 'zengxpang',
    //   },
    // });
    return this.appService.getName();
  }
}
