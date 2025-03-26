import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCandidateInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  password: string;
}
