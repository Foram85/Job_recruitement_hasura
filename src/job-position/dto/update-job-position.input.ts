import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PositionType } from '../enums/position-type.enum';
import { PositionStatus } from '../enums/position-status.enum';

@InputType()
export class UpdateJobPositionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  requirements?: string;

  @Field(() => PositionType, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PositionType)
  positionType?: PositionType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  experienceLevel?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  minSalary?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  maxSalary?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  jobLocation?: string;

  @Field(() => PositionStatus, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PositionStatus)
  positionStatus?: PositionStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isRemote?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  openingAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  departmentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  closingAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  openings?: number;
}
