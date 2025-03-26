import { GqlAuthGuard } from './../gql-auth.guard';
import { RecruiterGuard } from './../recruiter.guard';
import { CandidateGuard } from './../candidate.guard';
import { JobApplication } from './../job-application/entities/job-application.entity';
import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { Candidate } from './entities/candidate.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { ResetPasswordInput } from './dto/reset-pass-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';

@ObjectType()
export class CandidateAuthPayload {
  @Field()
  accessToken: string;

  @Field(() => [JobApplication])
  applications: JobApplication[];
}

@Resolver(() => Candidate)
export class CandidateResolver {
  constructor(private candidateService: CandidateService) {}

  @Mutation(() => CandidateAuthPayload)
  async create(
    @Args('data') data: CreateCandidateInput,
  ): Promise<CandidateAuthPayload> {
    return this.candidateService.setPassword(
      data.email,
      data.token,
      data.password,
    );
  }

  @Mutation(() => Boolean)
  async forgottenPassword(@Args('id') id: string): Promise<boolean> {
    await this.candidateService.forgottenPassword(id);
    return true;
  }

  @Mutation(() => CandidateAuthPayload)
  async resetPassword(
    @Args('data') data: ResetPasswordInput,
  ): Promise<CandidateAuthPayload> {
    return this.candidateService.setPassword(
      data.email,
      data.token,
      data.newPassword,
    );
  }

  @Query(() => [Candidate])
  @UseGuards(GqlAuthGuard, RecruiterGuard)
  async getAll(): Promise<Candidate[]> {
    return this.candidateService.findAll();
  }

  @Query(() => Candidate)
  @UseGuards(GqlAuthGuard, RecruiterGuard)
  async findOneById(@Args('id') id: string): Promise<Candidate> {
    return this.candidateService.findOneById(id);
  }

  @Mutation(() => Candidate)
  @UseGuards(GqlAuthGuard, CandidateGuard)
  async updateOneById(
    @Args('id') id: string,
    @Args('data') updateDto: UpdateCandidateInput,
    @Context() context,
  ): Promise<Candidate> {
    if (context.req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.candidateService.updateOneById(id, updateDto);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, CandidateGuard)
  async deleteById(
    @Args('id') id: string,
    @Context() context,
  ): Promise<string> {
    if (context.req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.candidateService.deleteById(id);
  }
}
