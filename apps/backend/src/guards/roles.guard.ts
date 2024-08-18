import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    )
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException(
        'User not found in request. Ensure AuthGuard is applied.',
      )
    }

    const hasRole = requiredRoles.some((role) => user.role === role)
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      )
    }

    return true
  }
}