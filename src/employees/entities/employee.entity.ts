import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Department } from 'src/department/entities/department.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatus } from '../enums/employee-status.interface';
import { EmployeeRole } from '../enums/employee-role.interface';

@ObjectType()
@Entity()
export class Employee {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Field()
  @Column()
  phone: string;

  @Field(() => EmployeeStatus)
  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.FullTime })
  status: EmployeeStatus;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;  

  @Field()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Field()
  @Column({ default: 'false', name: 'is_active' })
  isActive: boolean;

  @Field(() => EmployeeRole)
  @Column({ type: 'enum', enum: EmployeeRole, default: EmployeeRole.Employee })
  role: EmployeeRole;

  @Field()
  @Column({ type: 'timestamptz', name: 'hire_date' })
  hireDate: Date;

  @Field(() => Department)
  @ManyToOne(() => Department, {
    onDelete: 'CASCADE',
    eager: false,
  })
  department: Department;
}
