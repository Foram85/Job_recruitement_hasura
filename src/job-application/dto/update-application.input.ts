import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../interfaces/application-status.interface';

@InputType()
export class UpdateApplicationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
