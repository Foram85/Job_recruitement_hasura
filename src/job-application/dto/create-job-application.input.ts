import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateJobApplicationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  candidateId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  candidateEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  candidateName?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  coverLetter: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  expectedSalary: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  referralSource: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  resumeUrl: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  positionId: string;
}
