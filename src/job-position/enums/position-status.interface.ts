import { registerEnumType } from '@nestjs/graphql';

export enum PositionStatus {
  OPEN = 'OPEN',
  FILLED = 'FILLED',
}

registerEnumType(PositionStatus, {
  name: 'PositionStatus',
  description: 'Status of a job position',
});
