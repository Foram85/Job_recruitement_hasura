import { JobApplication } from './../../job-application/entities/job-application.entity';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Candidate {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [JobApplication])
  @OneToMany(() => JobApplication, (application) => application.candidate, {
    eager: true,
    cascade: true,
  })
  applications: JobApplication[];
}
