import { registerEnumType } from '@nestjs/graphql';

export enum EmployeeStatus {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract',
}

registerEnumType(EmployeeStatus, {
  name: 'EmployeeStatus',
  description: 'Employment status of an employee',
});
