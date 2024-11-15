// src/common/guards/permissions.guard.ts
import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorator/permissions.decorator';


@Injectable()
export class PermissionsGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    const user = context.switchToHttp().getRequest().user;

    // Jika tidak ada permissions yang dibutuhkan, beri akses
    if (!requiredPermissions) {
      return true;
    }

    // Periksa apakah user memiliki permissions yang dibutuhkan
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
