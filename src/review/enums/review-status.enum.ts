import { registerEnumType } from '@nestjs/graphql';

export enum ReviewStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
}

registerEnumType(ReviewStatus, {
  name: 'ReviewStatus',
  description: 'Status of a job application review',
});
