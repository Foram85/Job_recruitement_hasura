import { TokenType } from './../token/token.entity';
import { TokenService } from './../token/token.service';
import { JobApplication } from './../job-application/entities/job-application.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { UpdateCandidateInput } from './dto/update-candidate.input';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  hasura_claims: {
    "x-hasura-user-id": string;
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
    "x-hasura-role": string;
  };
}

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  private accessToken(candidate: Candidate): { accessToken: string } {
    const payload: JwtPayload = {
      id: candidate.id,
      email: candidate.email,
      role: "candidate",
      hasura_claims: {
        "x-hasura-user-id": candidate.id,
        "x-hasura-default-role": "candidate",
        "x-hasura-allowed-roles": ["candidate"],
        "x-hasura-role": "candidate",
      },
    };
  
    return { accessToken: this.jwtService.sign(payload) };
  }  
  

  async setPassword(
    email: string,
    token: string,
    password: string
  ): Promise<{ accessToken: string; applications: JobApplication[] }> {
    const validToken = await this.tokenService.findValidToken(token);
  
    if (!validToken) {
      const candidate = await this.candidateRepository.findOne({
        where: { email },
        relations: ["applications"],
      });
  
      if (candidate?.password) {
        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (isPasswordValid && candidate.email === email) {
          return {
            ...this.accessToken(candidate),
            applications: candidate.applications || [],
          };
        }
      }
      throw new UnauthorizedException("Invalid credentials");
    }
  
    let candidate = await this.candidateRepository.findOne({
      where: { email: validToken.email },
      relations: ["applications"],
    });
  
    if (!candidate) {
      candidate = this.candidateRepository.create({
        email: validToken.email,
        name: validToken.name,
      });
    }
  
    candidate.password = await bcrypt.hash(password, 10);
    candidate = await this.candidateRepository.save(candidate);
  
    // Link applications for new candidates
    await this.jobApplicationRepository
      .createQueryBuilder()
      .update(JobApplication)
      .set({ candidate })
      .where("candidateEmail = :email", { email: validToken.email })
      .execute();
  
    await this.tokenService.deleteToken(validToken.token);
  
    return {
      ...this.accessToken(candidate),
      applications: candidate.applications || [],
    };
  }
  

  async sendInvitation(email: string, name: string): Promise<void> {
    // Check if there's an active token
    const existingToken = await this.tokenService.findValidToken(email);
    if (existingToken) {
      return; // Don't send another invitation if one is active
    }

    const token = await this.tokenService.generateToken(
      email,
      name,
      TokenType.CANDIDATE,
      null,
      48,
    );

    await this.emailService.sendInvitation(email, name, token.token);
  }

  async forgottenPassword(id: string): Promise<void> {
    const candidate = await this.findOneById(id);
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    const token = await this.tokenService.generateToken(
      candidate.email,
      candidate.name,
      TokenType.CANDIDATE,
      candidate,
      48,
    );

    await this.emailService.sendResetPasswordEmail(
      candidate.email,
      candidate.name,
      token.token,
    );
  }

  async save(candidate: Candidate): Promise<Candidate> {
    return this.candidateRepository.save(candidate);
  }

  async findOneById(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('candidate not found');
    }
    return candidate;
  }

  async findByEmail(email: string): Promise<Candidate> {
    const foundUser = await this.candidateRepository.findOne({
      where: { email },
    });
    return foundUser;
  }

  async updateOneById(
    id: string,
    updateDto: UpdateCandidateInput,
  ): Promise<Candidate> {
    const existingCandidate = await this.findOneById(id);
    Object.assign(existingCandidate, updateDto);
    return this.candidateRepository.save(existingCandidate);
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  async deleteById(id: string) {
    this.candidateRepository.delete({ id });
    return 'deleted successfully';
  }
}
