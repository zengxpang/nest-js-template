import { SetMetadata } from '@nestjs/common';

import { AUTHORITY } from '@/common';

export const Authority = (...permissions: string[]) =>
  SetMetadata(AUTHORITY, permissions);
