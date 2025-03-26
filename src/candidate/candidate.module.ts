import { JobApplication } from './../job-application/entities/job-application.entity';
import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateResolver } from './candidate.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: '27ccbf47f939d30265ab6b862f80a8851c2db058669f0a4b0b727b5cd2a670f9',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Candidate, JobApplication]),
    EmailModule,
    TokenModule,
  ],
  providers: [CandidateService, CandidateResolver],
  exports: [CandidateService],
})
export class CandidateModule {}
