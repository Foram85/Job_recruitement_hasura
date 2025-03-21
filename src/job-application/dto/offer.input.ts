import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class OfferInput {
  @Field()
  @IsNotEmpty()
  offerLetterLink: string;

  @Field()
  @IsNotEmpty()
  joiningDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  salary?: number;
}
