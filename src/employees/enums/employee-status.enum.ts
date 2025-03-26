import { registerEnumType } from '@nestjs/graphql';

export enum EmployeeStatus {
  FullTime = 'FULL_TIME',
  PartTime = 'PART_TIME',
  Contract = 'CONTRACT',
}

registerEnumType(EmployeeStatus, {
  name: 'EmployeeStatus',
  description: 'Employment status of an employee',
});
