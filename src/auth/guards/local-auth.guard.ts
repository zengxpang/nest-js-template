import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL } from '@/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL) {}
