import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC } from '@/common/constants';

export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
