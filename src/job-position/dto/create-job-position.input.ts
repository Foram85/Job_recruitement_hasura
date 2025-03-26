import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PositionType } from '../enums/position-type.enum';

@InputType()
export class CreateJobPositionInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  requirements: string;

  @Field(() => PositionType)
  @IsNotEmpty()
  @IsEnum(PositionType)
  positionType: PositionType;

  @Field()
  @IsNotEmpty()
  experienceLevel: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  salaryMin: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  salaryMax: number;

  @Field()
  @IsNotEmpty()
  jobLocation: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isRemote: boolean;

  @Field()
  @IsNotEmpty()
  departmentId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  openingAt: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  closingAt: Date;

  @Field()
  @IsNotEmpty()
  openings: number;
}
