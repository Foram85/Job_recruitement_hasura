import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { JobApplicationModule } from './../job-application/job-application.module';
import { EmployeesModule } from './../employees/employees.module';
import { InterviewModule } from './../interview/interview.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    EmployeesModule,
    InterviewModule,
    JobApplicationModule,
  ],
  providers: [ReviewService, ReviewResolver],
  exports: [ReviewService],
})
export class ReviewModule {}
