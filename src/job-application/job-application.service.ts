import { JobPositionService } from './../job-position/job-position.service';
import { CandidateService } from './../candidate/candidate.service';
import { EmployeesService } from './../employees/employees.service';
import { EmployeeRole } from '../employees/enums/employee-role.enum';
import { JobPosition } from './../job-position/entities/job-position.entity';
import { PositionStatus } from '../job-position/enums/position-status.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from './entities/job-application.entity';
import { UpdateApplicationInput } from './dto/update-application.input';
import { EmailService } from '../email/email.service';
import { ApplicationStatus } from './enums/application-status.enum';
import { OfferInput } from './dto/offer.input';
import { CreateJobApplicationInput } from './dto/create-job-application.input';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private jobPositionRepository: JobPositionService,
    private candidateService: CandidateService,
    private employeeRepository: EmployeesService,
    private emailService: EmailService,
  ) {}

  async submitToHiringManager(
    id: string,
    hiringManagerId: string,
  ): Promise<JobApplication> {
    const application = await this.getById(id);
    const hiringManger = await this.employeeRepository.getById(hiringManagerId);
    if (!hiringManger || hiringManger.role !== EmployeeRole.HiringManager) {
      throw new NotFoundException('Hiring Manger Not Found');
    }
    application.reviewerId = hiringManger;
    application.status = ApplicationStatus.SCREENING;
    const updatedApplication =
      await this.jobApplicationRepository.save(application);

    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;

    await this.emailService.sendNewApplicationNotification(
      hiringManger.email,
      candidateName,
      application.id,
    );
    return updatedApplication;
  }

  async sendOfferToCandidate(
    id: string,
    offerDto: OfferInput,
  ): Promise<JobApplication> {
    const application = await this.getById(id);
    if (application.status === ApplicationStatus.REJECTED || application.status !== ApplicationStatus.REVIEW) {
      throw new BadRequestException(
        'Application is rejected or not reviewed yet',
      );
    }    
    const candidateEmail = application.candidate
      ? application.candidate.email
      : application.candidateEmail;
    const candidateName = application.candidate
      ? application.candidate.name
      : application.candidateName;

    await this.emailService.sendOfferToCandidate(
      candidateEmail,
      candidateName,
      {
        offerLetterLink: offerDto.offerLetterLink,
        joiningDate: offerDto.joiningDate,
        positionName: application.position.title,
      },
    );
    application.status = ApplicationStatus.OFFER;
    return await this.jobApplicationRepository.save(application);
  }

  async addApplication(
    createDto: CreateJobApplicationInput,
  ): Promise<JobApplication> {
    const position = await this.jobPositionRepository.getById(
      createDto.positionId,
    );
    if (!position || position.positionStatus == PositionStatus.FILLED)
      throw new NotFoundException(
        'sorry!! this Position does not exist or is already filled.',
      );

    if (createDto.candidateId) {
      return this.addRegisteredCandidateApplication(createDto, position);
    }
    if (!createDto.candidateEmail || !createDto.candidateName) {
      throw new BadRequestException(
        'Candidate email and name are required for unregistered users',
      );
    }

    if (createDto.candidateEmail) {
      const existingCandidate = await this.candidateService.findByEmail(
        createDto.candidateEmail,
      );

      if (existingCandidate) {
        throw new BadRequestException(
          `This email is already registered. Please provide the candidateId (${existingCandidate.id}) instead.`,
        );
      }
    }
    return this.addUnregisteredCandidateApplication(createDto, position);
  }

  private async addRegisteredCandidateApplication(
    createDto: CreateJobApplicationInput,
    position: JobPosition,
  ): Promise<JobApplication> {
    const candidate = await this.candidateService.findOneById(
      createDto.candidateId,
    );
    if (!candidate) throw new NotFoundException('Candidate not found');

    const existingApp = await this.jobApplicationRepository.findOne({
      where: {
        position: { id: createDto.positionId },
        candidate: { id: createDto.candidateId },
      },
    });
    if (existingApp) {
      throw new BadRequestException(
        'Candidate has already applied for this position',
      );
    }

    const application = this.jobApplicationRepository.create({
      ...createDto,
      candidate,
      candidateEmail: candidate.email,
      candidateName: candidate.name,
      position,
    });
    return await this.jobApplicationRepository.save(application);
  }

  private async addUnregisteredCandidateApplication(
    createDto: CreateJobApplicationInput,
    position: JobPosition,
  ): Promise<JobApplication> {
    if (!createDto.candidateEmail || !createDto.candidateName) {
      throw new BadRequestException(
        'Candidate email and name are required for unregistered users',
      );
    }

    const existingApp = await this.jobApplicationRepository.findOne({
      where: {
        position: { id: createDto.positionId },
        candidateEmail: createDto.candidateEmail,
      },
    });
    if (existingApp) {
      throw new BadRequestException(
        'Candidate has already applied for this position',
      );
    }

    const application = this.jobApplicationRepository.create({
      ...createDto,
      candidateEmail: createDto.candidateEmail,
      candidateName: createDto.candidateName,
      candidate: null,
      position,
    });
    await this.candidateService.sendInvitation(
      createDto.candidateEmail,
      createDto.candidateName,
    );
    return await this.jobApplicationRepository.save(application);
  }

  async save(application: JobApplication): Promise<JobApplication> {
    return this.jobApplicationRepository.save(application);
  }

  async getAll(status: ApplicationStatus): Promise<JobApplication[]> {
    const query =
      this.jobApplicationRepository.createQueryBuilder('application');
    if (status) {
      query.andWhere('application.status = :status', { status });
    }
    return query.getMany();
  }

  async getById(id: string): Promise<JobApplication> {
    const apl = this.jobApplicationRepository.findOne({
      where: { id },
      relations: ['position', 'candidate'],
    });
    if (!apl) {
      throw new NotFoundException('Application not found');
    }
    return apl;
  }

  async updateById(
    id: string,
    updateDto: UpdateApplicationInput,
  ): Promise<JobApplication> {
    const apl = await this.getById(id);
    Object.assign(apl, updateDto);
    if (updateDto.status === ApplicationStatus.HIRED) {
      const position = await this.jobPositionRepository.getById(
        apl.position.id,
      );
      position.openings = Math.max(0, position.openings - 1);
      if (position.openings === 0) {
        position.positionStatus = PositionStatus.FILLED;
      }

      await this.jobPositionRepository.save(position);

      if (apl.candidate) {
        await this.candidateService.deleteById(apl.candidate.id);
      } else {
        await this.jobApplicationRepository
          .createQueryBuilder()
          .delete()
          .from(JobApplication)
          .where('candidateEmail = :email', {
            email: apl.candidateEmail,
          })
          .execute();
      }
      return apl;
    }
    return await this.jobApplicationRepository.save(apl);
  }
}
