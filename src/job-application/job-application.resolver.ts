import { GqlAuthGuard } from './../gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobApplication } from './entities/job-application.entity';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationInput } from './dto/create-job-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';
import { OfferInput } from './dto/offer.input';
import { UseGuards } from '@nestjs/common';
import { ApplicationStatus } from './enums/application-status.enum';

@UseGuards(GqlAuthGuard)
@Resolver(() => JobApplication)
export class JobApplicationResolver {
  constructor(private jobApplicationService: JobApplicationService) {}

  @Mutation(() => JobApplication)
  async createJobApplication(
    @Args('data') data: CreateJobApplicationInput,
  ): Promise<JobApplication> {
    return this.jobApplicationService.addApplication(data);
  }

  @Mutation(() => JobApplication)
  async submitToHiringManager(
    @Args('id') id: string,
    @Args('hiringManagerId') hiringManagerId: string,
  ): Promise<JobApplication> {
    return this.jobApplicationService.submitToHiringManager(
      id,
      hiringManagerId,
    );
  }

  @Mutation(() => JobApplication)
  async offerCandidate(
    @Args('id') id: string,
    @Args('offerData') offerData: OfferInput,
  ): Promise<JobApplication> {
    return this.jobApplicationService.sendOfferToCandidate(id, offerData);
  }

  @Query(() => [JobApplication])
  async getJobApplications(
    @Args('status', { type: () => ApplicationStatus, nullable: true }) status?: ApplicationStatus,
  ): Promise<JobApplication[]> {
    return this.jobApplicationService.getAll(status);
  }

  @Query(() => JobApplication)
  async getJobApplicationById(@Args('id') id: string): Promise<JobApplication> {
    return this.jobApplicationService.getById(id);
  }

  @Mutation(() => JobApplication)
  async updateJobApplication(
    @Args('id') id: string,
    @Args('data') updateData: UpdateApplicationInput,
  ): Promise<JobApplication> {
    return this.jobApplicationService.updateById(id, updateData);
  }
}
