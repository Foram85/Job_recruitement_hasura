import { GqlAuthGuard } from './../gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JobPosition } from './entities/job-position.entity';
import { JobPositionService } from './job-position.service';
import { CreateJobPositionInput } from './dto/create-job-position.input';
import { UpdateJobPositionInput } from './dto/update-job-position.input';
import { FilterPositionInput } from './dto/filter-position.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => JobPosition)
export class JobPositionResolver {
  constructor(private jobPositionService: JobPositionService) {}

  @Mutation(() => JobPosition)
  async createJobPosition(
    @Args('data') createDto: CreateJobPositionInput,
  ): Promise<JobPosition> {
    return this.jobPositionService.createJobPosition(createDto);
  }

  @Query(() => JobPosition)
  async getJobPositionById(@Args('id') id: string): Promise<JobPosition> {
    return this.jobPositionService.getById(id);
  }

  @Mutation(() => JobPosition)
  async updateJobPosition(
    @Args('id') id: string,
    @Args('data') updateDto: UpdateJobPositionInput,
  ): Promise<JobPosition> {
    return this.jobPositionService.updateById(id, updateDto);
  }

  @Query(() => [JobPosition])
  async getAllJobPositions(
    @Args('filter', { nullable: true }) filterDto?: FilterPositionInput,
  ): Promise<JobPosition[]> {
    return this.jobPositionService.getAllJobPositions(filterDto);
  }

  @Mutation(() => Boolean)
  async deleteJobPosition(@Args('id') id: string): Promise<boolean> {
    await this.jobPositionService.deleteById(id);
    return true;
  }
}
