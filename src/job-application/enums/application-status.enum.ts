import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  NEW = 'NEW',
  SCREENING = 'SCREENING',
  APPROVED = 'APPROVED',
  INTERVIEW = 'INTERVIEW',
  REVIEW = 'REVIEW',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
  description: 'Current status of a job application',
});
