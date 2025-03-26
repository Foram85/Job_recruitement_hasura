import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EmployeeRole } from './employees/enums/employee-role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class HiringManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    if (user.role !== EmployeeRole.HiringManager) {
      throw new ForbiddenException('Access restricted to Hiring Managers only');
    }

    return true;
  }
}
