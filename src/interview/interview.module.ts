import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewResolver } from './interview.resolver';
import { Interview } from './entities/interview.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { JobApplicationModule } from 'src/job-application/job-application.module';
import { EmailModule } from 'src/email/email.module';

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
