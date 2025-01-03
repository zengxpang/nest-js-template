import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class AppService {
  @Inject(I18nService)
  i18n: I18nService<I18nTranslations>;

  getHello(): string {
    return this.i18n.t('test.Hello');
  }

  getName(): string {
    return this.i18n.t('test.Name', {
      lang: I18nContext.current().lang, // 这个好像可以不要
      args: {
        name: 'zengxpang',
      },
    });
  }
}
