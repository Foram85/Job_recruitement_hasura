import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  interviewId: string;

  @Field()
  @IsNotEmpty()
  reviewText: string;

  @Field()
  @IsNotEmpty()
  reviewDate: Date;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isRecommended: boolean;

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
