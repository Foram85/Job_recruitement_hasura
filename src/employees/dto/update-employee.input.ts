import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EmployeeRole } from '../enums/employee-role.enum';
import { EmployeeStatus } from '../enums/employee-status.enum';

@InputType()
export class UpdateEmployeeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  hireDate?: Date;

  @Field(() => EmployeeRole, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @Field(() => EmployeeStatus, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(EmployeeStatus)
  employementStatus?: EmployeeStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  departmentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
