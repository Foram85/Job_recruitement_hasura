import { EmployeesModule } from './../employees/employees.module';
import { JobPositionModule } from './../job-position/job-position.module';
import { CandidateModule } from './../candidate/candidate.module';
import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationResolver } from './job-application.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication]),
    JobPositionModule,
    CandidateModule,
    EmployeesModule,
    EmailModule,
  ],
  providers: [JobApplicationService, JobApplicationResolver],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
