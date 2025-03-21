import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { Employee } from 'src/employees/entities/employee.entity';
import { Interview } from 'src/interview/entities/interview.entity';
import { ReviewStatus } from '../enums/review-status.dto';

@ObjectType()
@Entity()
export class Review {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Field()
  @Column({ type: 'timestamptz', name: 'review_date' })
  reviewDate: Date;

  @Field()
  @Column({ name: 'review_text' })
  reviewText: string;

  @Field()
  @Column()
  isRecommended: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'technical_score' })
  technicalScore: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'communication_score' })
  communicationScore: number;

  @Field(() => ReviewStatus)
  @Column({ type: 'enum', enum: ReviewStatus,  default: ReviewStatus.SUBMITTED })
  status: ReviewStatus;

  @Field(() => Employee)
  @ManyToOne(() => Employee, { onDelete: 'CASCADE', eager: false })
  employee: Employee;

  @Field(() => Interview)
  @JoinColumn()
  @OneToOne(() => Interview, { onDelete: 'CASCADE', eager: false })
  interview: Interview;
}
