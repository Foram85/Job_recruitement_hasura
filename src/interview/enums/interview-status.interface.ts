import { registerEnumType } from '@nestjs/graphql';

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(InterviewStatus, {
  name: 'InterviewStatus',
  description: 'Current status of an interview',
});
