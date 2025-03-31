import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentModule } from './department/department.module';
import { JobPositionModule } from './job-position/job-position.module';
import { CandidateModule } from './candidate/candidate.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { InterviewModule } from './interview/interview.module';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmployeesModule,
    DepartmentModule,
    JobPositionModule,
    CandidateModule,
    JobApplicationModule,
    InterviewModule,
    TokenModule,
    ReviewModule
  ],
})
export class AppModule {}