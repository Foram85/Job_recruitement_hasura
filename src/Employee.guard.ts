import { EmployeeRole } from './employees/enums/employee-role.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class employeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (
      user.role !== EmployeeRole.Recruiter &&
      user.role !== EmployeeRole.HiringManager &&
      user.role !== EmployeeRole.Interviewer &&
      user.role !== EmployeeRole.HR &&
      user.role != EmployeeRole.Employee
    ) {
      throw new ForbiddenException('Only Employee can access this service.');
    }
    return true;
  }
}
