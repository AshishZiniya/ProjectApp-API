import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../users/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
