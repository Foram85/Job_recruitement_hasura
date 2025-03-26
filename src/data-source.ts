import { DataSource } from 'typeorm';
import { JobApplication } from './job-application/entities/job-application.entity';
import { JobPosition } from './job-position/entities/job-position.entity';
import { Department } from './department/entities/department.entity';
import { Candidate } from './candidate/entities/candidate.entity';
import { Employee } from './employees/entities/employee.entity';
import { Interview } from './interview/entities/interview.entity';
import { Review } from './review/entities/review.entity';
import { Token } from './token/token.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  entities: [JobApplication, JobPosition, Department, Candidate, Employee, Interview, Review, Token],
  migrations: ['./src/migrations/*{.ts,.js}'],
  synchronize: false,
});
