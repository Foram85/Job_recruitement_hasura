import { Department } from './../../department/entities/department.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PositionType } from '../enums/position-type.enum';
import { PositionStatus } from '../enums/position-status.enum';

@ObjectType()
@Entity()
export class JobPosition {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field()
  @Column()
  requirements: string;

  @Field(() => PositionType)
  @Column({ type: 'enum', enum: PositionType, name: 'position_type' })
  positionType: PositionType;

  @Field()
  @Column({ name: 'experience_level' })
  experienceLevel: string;

  @Field()
  @Column({ name: 'salary_min' })
  salaryMin: number;

  @Field()
  @Column({ name: 'salary_max' })
  salaryMax: number;

  @Field()
  @Column({ name: 'job_location' })
  jobLocation: string;

  @Field(() => PositionStatus)
  @Column({ type: 'enum', enum: PositionStatus,  default: PositionStatus.OPEN, name: 'position_status' })
  positionStatus: PositionStatus;

  @Field()
  @Column({ default: false, name: 'is_remote' })
  isRemote: boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Field()
  @Column({ type: 'timestamptz', name: 'opening_at' })
  openingAt: Date;

  @Field()
  @Column({ type: 'timestamptz', name: 'closing_at' })
  closingAt: Date;

  @Field()
  @Column()
  openings: number;

  @Field(() => Department)
  @ManyToOne(() => Department, { onDelete: 'CASCADE', eager: false })
  department: Department;
}

