import { registerEnumType } from '@nestjs/graphql';

export enum InterviewType {
  VIRTUAL = 'VIRTUAL',
  IN_PERSON = 'IN_PERSON',
  PHONE = 'PHONE',
}

registerEnumType(InterviewType, {
  name: 'InterviewType',
  description: 'Type of interview being conducted',
});
