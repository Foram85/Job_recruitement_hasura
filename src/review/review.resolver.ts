import { GqlAuthGuard } from './../gql-auth.guard';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Review)
export class ReviewResolver {
  constructor(private reviewService: ReviewService) {}

  @Mutation(() => Review)
  async createReview(
    @Args('data') data: CreateReviewInput,
    @Context('req') req: any, 
  ): Promise<Review> {
    const employeeId = req.user.id; 
    return this.reviewService.create({ ...data, employeeId } as any);
  }
  
  @Query(() => Review)
  async getReviewById(@Args('id') id: string): Promise<Review> {
    return this.reviewService.getById(id);
  }

  @Mutation(() => Review)
  async updateReview(
    @Args('id') id: string,
    @Args('data') updateData: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewService.updateById(id, updateData);
  }

  @Query(() => [Review])
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAll();
  }

  @Mutation(() => String)
  async deleteReview(@Args('id') id: string): Promise<string> {
    return this.reviewService.deleteById(id);
  }
}
