import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EmployeeResetPasswordInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  newPassword: string;
}
