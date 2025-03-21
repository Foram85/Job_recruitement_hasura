import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { InterviewType } from '../enums/interview-type.interface';

@InputType()
export class CreateInterviewInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  applicationId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  employeeId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  link?: string;

  @Field()
  @IsNotEmpty()
  start: Date;

  @Field()
  @IsNotEmpty()
  end: Date;

  @Field()
  @IsNotEmpty()
  @IsEnum(InterviewType)
  type: InterviewType;

  @Field()
  @IsNotEmpty()
  round: number;
}
