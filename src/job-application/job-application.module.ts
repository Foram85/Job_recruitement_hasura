import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationResolver } from './job-application.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { JobPositionModule } from 'src/job-position/job-position.module';
import { EmailModule } from '../email/email.module';
import { EmployeesModule } from 'src/employees/employees.module';

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
