import { EmployeeRole } from './employees/enums/employee-role.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RecruiterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (user.role !== EmployeeRole.Recruiter) {
      throw new ForbiddenException('Only Recruiter can access this service.');
    }
    return true;
  }
}
