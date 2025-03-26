import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

@InputType()
export class UpdateApplicationInput {
  @Field(() => ApplicationStatus)
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
