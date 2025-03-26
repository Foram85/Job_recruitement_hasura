import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateCandidateInput {
  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  name?: string;
}
