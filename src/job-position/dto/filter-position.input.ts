import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsBoolean, IsString } from 'class-validator';
import { PositionType } from '../enums/position-type.interface';
import { PositionStatus } from '../enums/position-status.interface';

@InputType()
export class FilterPositionInput {
  @Field(() => PositionType, { nullable: true })
  @IsOptional()
  @IsEnum(PositionType)
  type?: PositionType;

  @Field(() => PositionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PositionStatus)
  status?: PositionStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
