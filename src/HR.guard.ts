import { EmployeeRole } from './employees/enums/employee-role.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class HrGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req; 
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (user.role !== EmployeeRole.HR) {
      throw new ForbiddenException('Only HR can access this service.');
    }
    return true;
  }
}
