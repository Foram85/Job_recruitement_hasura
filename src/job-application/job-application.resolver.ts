import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobApplication } from './entities/job-application.entity';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationInput } from './dto/create-job-application.input';
import { UpdateApplicationInput } from './dto/update-application.input';
import { OfferInput } from './dto/offer.input';
import { UseGuards } from '@nestjs/common';
import { RecruiterGuard } from 'src/recruiter.guard';
import { HiringManagerGuard } from 'src/hiring-manager.guard';
import { ApplicationStatus } from './interfaces/application-status.interface';
import { GqlAuthGuard } from 'src/gql-auth.guard';

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
  @UseGuards(GqlAuthGuard, RecruiterGuard)
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
  @UseGuards(GqlAuthGuard, RecruiterGuard)
  async offerCandidate(
    @Args('id') id: string,
    @Args('offerData') offerData: OfferInput,
  ): Promise<JobApplication> {
    return this.jobApplicationService.sendOfferToCandidate(id, offerData);
  }

  @Query(() => [JobApplication])
  @UseGuards(GqlAuthGuard, RecruiterGuard)
  async getJobApplications(
    @Args('status', { nullable: true }) status?: ApplicationStatus,
  ): Promise<JobApplication[]> {
    return this.jobApplicationService.getAll(status);
  }

  @Query(() => JobApplication)
  @UseGuards(GqlAuthGuard, HiringManagerGuard)
  async getJobApplicationById(@Args('id') id: string): Promise<JobApplication> {
    return this.jobApplicationService.getById(id);
  }

  @Mutation(() => JobApplication)
  @UseGuards(GqlAuthGuard, HiringManagerGuard)
  async updateJobApplication(
    @Args('id') id: string,
    @Args('data') updateData: UpdateApplicationInput,
  ): Promise<JobApplication> {
    return this.jobApplicationService.updateById(id, updateData);
  }
}
