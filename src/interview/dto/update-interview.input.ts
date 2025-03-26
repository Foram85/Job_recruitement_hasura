import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { InterviewType } from '../enums/interview-type.enum';

@InputType()
export class UpdateInterviewInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  link?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  start?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  end?: Date;

  @Field(() => InterviewType, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum({ InterviewType })
  type?: InterviewType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  round?: number;
}
