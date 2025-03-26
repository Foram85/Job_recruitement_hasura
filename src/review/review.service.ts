import { UpdateReviewInput } from './dto/update-review.input';
import { CreateReviewInput } from './dto/create-review.input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from './../employees/employees.service';
import { InterviewService } from './../interview/interview.service';
import { JobApplicationService } from './../job-application/job-application.service';
import { ReviewStatus } from './enums/review-status.enum';
import { InterviewStatus } from '../interview/enums/interview-status.enum';
import { ApplicationStatus } from '../job-application/enums/application-status.enum';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private employeeService: EmployeesService,
    private interviewService: InterviewService,
    private jobApplicationService: JobApplicationService,
  ) {}

  async create(createDto: CreateReviewInput & { employeeId: string }): Promise<Review> {
    const employee = await this.employeeService.getById(createDto.employeeId);
    const interview = await this.interviewService.getById(createDto.interviewId);
  
    if (!employee) throw new NotFoundException('Employee not found');
    if (!interview) throw new NotFoundException('Interview not found');
  
    const review = this.reviewRepository.create({
      ...createDto,
      employee, 
      interview,
    });

    review.status = ReviewStatus.SUBMITTED;
    interview.status = InterviewStatus.COMPLETED;
  
    if (review.isRecommended === false) {
      interview.application.status = ApplicationStatus.REJECTED;
    } else {
      interview.application.status = ApplicationStatus.REVIEW;
    }
  
    interview.application.hasReviewed = true;
    await this.jobApplicationService.save(interview.application);
    await this.interviewService.save(interview);
  
    return this.reviewRepository.save(review);
  }
  
  async getAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['interview', 'interview.application'],
    });
  }

  async getById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['interview', 'interview.application'],
    });
    if (!review) throw new NotFoundException('Review not found.');
    return review;
  }

  async updateById(id: string, updateDto: UpdateReviewInput): Promise<Review> {
    const review = await this.getById(id);
    Object.assign(review, updateDto);
    const updatedReview = await this.reviewRepository.save(review);

    const application = review.interview?.application;
    if (application) {
      if (application.status === ApplicationStatus.REJECTED) {
          throw new NotFoundException('This application is already rejected.');
      }
      application.status = updateDto.isRecommended
        ? ApplicationStatus.REVIEW
        : ApplicationStatus.REJECTED;
      await this.jobApplicationService.save(application);
    }
    return updatedReview;
  }

  async deleteById(id: string): Promise<string> {
    await this.reviewRepository.delete({ id });
    return 'Deleted successfully';
  }
}
