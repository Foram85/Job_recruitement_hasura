import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDepartmentInput {
  @IsNotEmpty()
  @Field()
  name: string;
}
