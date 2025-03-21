import { registerEnumType } from '@nestjs/graphql';

export enum EmployeeRole {
  Interviewer = 'INTERVIEWER',
  HiringManager = 'HIRING_MANAGER',
  Recruiter = 'RECRUITER',
  Employee = 'EMPLOYEE',
  HR = 'HR',
}

registerEnumType(EmployeeRole, {
  name: 'EmployeeRole',
  description: 'Role of an employee in the hiring process',
});
