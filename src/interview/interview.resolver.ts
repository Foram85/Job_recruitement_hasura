import { GqlAuthGuard } from './../gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Interview } from './entities/interview.entity';
import { InterviewService } from './interview.service';
import { CreateInterviewInput } from './dto/create-interview.input';
import { UpdateInterviewInput } from './dto/update-interview.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Interview)
export class InterviewResolver {
  constructor(private interviewService: InterviewService) {}

  @Mutation(() => Interview)
  async registerInterview(
    @Args('data') data: CreateInterviewInput,
  ): Promise<Interview> {
    return this.interviewService.create(data);
  }

  @Query(() => [Interview])
  async getAllInterviews(): Promise<Interview[]> {
    return this.interviewService.getAll();
  }

  @Query(() => Interview)
  async getInterviewById(@Args('id') id: string): Promise<Interview> {
    return this.interviewService.getById(id);
  }

  @Mutation(() => Interview)
  async updateInterview(
    @Args('id') id: string,
    @Args('data') updateInput: UpdateInterviewInput,
  ): Promise<Interview> {
    return this.interviewService.updateById(id, updateInput);
  }

  @Mutation(() => Boolean)
  async deleteInterview(@Args('id') id: string): Promise<boolean> {
    await this.interviewService.deleteById(id);
    return true;
  }
}
