import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ReviewStatus } from '../enums/review-status.enum';

@InputType()
export class UpdateReviewInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  interviewId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  reviewText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  reviewDate?: Date;

  @Field(() => ReviewStatus, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isRecommended?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  communicationScore?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  technicalScore?: number;
}
