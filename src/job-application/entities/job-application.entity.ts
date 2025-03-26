import { JobPosition } from './../../job-position/entities/job-position.entity';
import { Employee } from './../../employees/entities/employee.entity';
import { Candidate } from './../../candidate/entities/candidate.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum';

@ObjectType()
@Entity()
export class JobApplication {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'candidate_email' })
  candidateEmail: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'candidate_name' })
  candidateName: string;

  @Field()
  @Column({ name: 'cover_letter' })
  coverLetter: string;

  @Field()
  @Column({ name: 'expected_salary' })
  expectedSalary: number;

  @Field()
  @Column({ name: 'referral_source' })
  referralSource: string;

  @Field()
  @Column({ name: 'resume_url' })
  resumeUrl: string;

  @Field(() => ApplicationStatus)
  @Column({ type: 'enum', enum: ApplicationStatus,  default: ApplicationStatus.NEW })
  status: ApplicationStatus;

  @Field()
  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;

  @Field()
  @Column({ default: false, name: 'has_reviewed' })
  hasReviewed: boolean;

  @Field(() => Candidate, { nullable: true })
  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    eager: false,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  candidate: Candidate;

  @Field(() => JobPosition)
  @ManyToOne(() => JobPosition, { onDelete: 'CASCADE', eager: true })
  position: JobPosition;

  @Field(() => Employee, { nullable: true })
  @ManyToOne(() => Employee, { nullable: true, eager: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewerId: Employee;
}
