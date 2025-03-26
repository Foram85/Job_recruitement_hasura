import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { EmployeeRole } from '../enums/employee-role.enum';

@InputType()
export class CreateEmployeeInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => EmployeeRole)
  @IsNotEmpty()
  @IsOptional()
  role?: EmployeeRole;

  @Field()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsNotEmpty()
  hireDate: Date;

  @Field()
  @IsNotEmpty()
  departmentId: string;
}
