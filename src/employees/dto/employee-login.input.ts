import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EmployeeLoginInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  password: string;
}
