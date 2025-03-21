import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Department } from './entities/department.entity';
import { DepartmentService } from './department.service';
import { CreateDepartmentInput } from './dto/create-department.input';
import { HrGuard } from 'src/HR.guard';
import { GqlAuthGuard } from 'src/gql-auth.guard';

@Resolver(() => Department)
@UseGuards(GqlAuthGuard, HrGuard)
export class DepartmentResolver {
  constructor(private departmentService: DepartmentService) {}

  @Mutation(() => Department)
  async createDepartment(
    @Args('data') data: CreateDepartmentInput,
  ): Promise<Department> {
    return this.departmentService.create(data);
  }

  @Query(() => [Department])
  async getAllDepartments(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Query(() => Department)
  async getDepartmentById(@Args('id') id: string): Promise<Department> {
    return this.departmentService.findOneById(id);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(@Args('id') id: string): Promise<boolean> {
    await this.departmentService.deleteById(id);
    return true;
  }
}
