import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate, Interview } from './entities/interview.entity';
import { Repository } from 'typeorm';
import { CreateInterviewInput } from './dto/create-interview.input';
import { EmployeesService } from './../employees/employees.service';
import { JobApplicationService } from './../job-application/job-application.service';
import { EmailService } from './../email/email.service';
import { ApplicationStatus } from '../job-application/enums/application-status.enum';
import { EmployeeRole } from '../employees/enums/employee-role.enum';
import { JobApplication } from 'job-application/entities/job-application.entity';
import { Employee } from './../employees/entities/employee.entity';
import { UpdateInterviewInput } from './dto/update-interview.input';


@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    private employeeRepository: EmployeesService,
    private applicationRepository: JobApplicationService,
    private emailService: EmailService,
  ) {}

  async create(createDto: CreateInterviewInput) {
    const [application, employee] = await Promise.all([
      this.applicationRepository.getById(createDto.applicationId),
      this.employeeRepository.getById(createDto.employeeId),
    ]);

    if (
      !application ||
      (application.status !== ApplicationStatus.APPROVED &&
        application.status !== ApplicationStatus.REVIEW)
    ) {
      throw new NotFoundException(
        'Application not found or not approved/reviewed yet.',
      );
    }

    // Enforce HR role for round 2 if needed
    if (createDto.round === 2 && employee.role !== EmployeeRole.HR) {
      throw new NotFoundException(
        'For round 2, the assigned employee must be HR.',
      );
    }

    // Always create a new interview for each round
    const interview = this.interviewRepository.create({
      ...createDto,
      application,
      employee,
    });

    const savedInterview = await this.interviewRepository.save(interview);

    application.status = ApplicationStatus.INTERVIEW;
    application.hasReviewed = false;
    application.reviewerId = employee;
    await this.applicationRepository.save(application);

    // await this.sendInterviewEmails(application, employee, savedInterview);

    return savedInterview;
  }

  private async sendInterviewEmails(
    application: JobApplication,
    employee: Employee,
    interview: Interview,
  ) {
    const candidateEmail = application.candidate
      ? application.candidate.email
      : application.candidateEmail;
    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;

    await this.emailService.sendInterviewDetailsToCandidate(
      candidateEmail,
      candidateName,
      {
        schedule_start_date: formatDate(interview.start),
        schedule_end_date: formatDate(interview.end),
        meeting_link: interview.link,
        round: interview.round,
        type: interview.type,
      },
    );

    await this.emailService.sendInterviewDetailsToInterviewer(
      employee.email,
      employee.name,
      candidateName,
      application.resumeUrl,
      {
        schedule_start_date: formatDate(interview.start),
        schedule_end_date: formatDate(interview.end),
        meeting_link: interview.link,
      },
    );
  }

  async save(interview: Interview): Promise<Interview> {
    return this.interviewRepository.save(interview);
  }

  async getAll(): Promise<Interview[]> {
    return this.interviewRepository.find();
  }

  async getById(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['employee', 'application', 'application.candidate'],
    });
    if (!interview) {
      throw new NotFoundException('Interview id not found');
    }
    return interview;
  }

  async updateById(
    id: string,
    updateDto: UpdateInterviewInput,
  ): Promise<Interview> {
    const interview = await this.getById(id);
    Object.assign(interview, updateDto);
    const updatedInterview = await this.interviewRepository.save(interview);
    if (
      interview.application &&
      interview.application.status !== ApplicationStatus.REJECTED
    ) {
      interview.application.status = ApplicationStatus.INTERVIEW;
      await this.sendInterviewEmails(
        interview.application,
        interview.employee,
        interview,
      );
      await this.applicationRepository.save(interview.application);
    }
    return updatedInterview;
  }

  async deleteById(id: string) {
    return this.interviewRepository.delete({ id });
  }
}
