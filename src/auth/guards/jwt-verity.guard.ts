import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_VERIFY } from '@/common';

@Injectable()
export class JwtVerifyGuard extends AuthGuard(JWT_VERIFY) {}
