import { JobApplication } from './../../job-application/entities/job-application.entity';
import { Employee } from './../../employees/entities/employee.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InterviewStatus } from '../enums/interview-status.enum';
import { InterviewType } from '../enums/interview-type.enum';

@ObjectType()
@Entity()
export class Interview {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  start: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  end: Date;

  @Field(() => InterviewStatus)
  @Column({ type: 'enum', enum: InterviewStatus,  default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Field(() => InterviewType)
  @Column({ type: 'enum', enum: InterviewType })
  type: InterviewType;

  @Field()
  @Column()
  link: string;

  @Field()
  @Column()
  round: number;

  @Field(() => JobApplication)
  @JoinColumn()
  @ManyToOne(() => JobApplication, { onDelete: 'CASCADE', eager: true })
  application: JobApplication;

  @Field(() => Employee)
  @ManyToOne(() => Employee, { onDelete: 'CASCADE', eager: false })
  employee: Employee;
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
