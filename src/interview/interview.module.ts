import { JobApplicationModule } from './../job-application/job-application.module';
import { EmailModule } from './../email/email.module';
import { EmployeesModule } from './../employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewResolver } from './interview.resolver';
import { Interview } from './entities/interview.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview]),
    EmployeesModule,
    JobApplicationModule,
    EmailModule,
  ],
  providers: [InterviewService, InterviewResolver],
  exports: [InterviewService],
})
export class InterviewModule {}
