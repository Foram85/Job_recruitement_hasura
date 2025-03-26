import { GqlAuthGuard } from './../gql-auth.guard';
import { employeeGuard } from './../Employee.guard';
import { HrGuard } from './../HR.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { Field, ObjectType } from '@nestjs/graphql';
import { EmployeeLoginInput } from './dto/employee-login.input';
import { EmployeeResetPasswordInput } from './dto/reset-pass-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@ObjectType()
export class EmployeeAuthPayload {
  @Field()
  accessToken: string;
}

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private employeesService: EmployeesService) {}

  @Mutation(() => Employee)
  @UseGuards(GqlAuthGuard, HrGuard)
  async registerEmployee(
    @Args('data') data: CreateEmployeeInput,
  ): Promise<Employee> {
    return this.employeesService.addEmployee(data);
  }

  @Mutation(() => EmployeeAuthPayload)
  async loginEmployee(
    @Args('data') data: EmployeeLoginInput,
  ): Promise<EmployeeAuthPayload> {
    return this.employeesService.login(data.email, data.token, data.password);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('id') id: string): Promise<boolean> {
    await this.employeesService.forgotPassword(id);
    return true;
  }

  @Mutation(() => EmployeeAuthPayload)
  async resetPassword(
    @Args('data') data: EmployeeResetPasswordInput,
  ): Promise<EmployeeAuthPayload> {
    return this.employeesService.login(
      data.email,
      data.token,
      data.newPassword,
    );
  }

  @Query(() => [Employee])
  @UseGuards(GqlAuthGuard, employeeGuard)
  async getEmployees(): Promise<Employee[]> {
    return this.employeesService.getAll();
  }

  @Query(() => Employee)
  @UseGuards(GqlAuthGuard, employeeGuard)
  async getEmployeeById(@Args('id') id: string): Promise<Employee> {
    return this.employeesService.getById(id);
  }

  @Mutation(() => Employee)
  // @UseGuards(GqlAuthGuard, HrGuard)
  async updateEmployee(
    @Args('id') id: string,
    @Args('data') updateData: UpdateEmployeeInput,
  ): Promise<Employee> {
    return this.employeesService.updateById(id, updateData);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, HrGuard)
  async deleteEmployee(@Args('id') id: string): Promise<boolean> {
    await this.employeesService.deleteById(id);
    return true;
  }
}
