import { registerEnumType } from '@nestjs/graphql';

export enum PositionType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

registerEnumType(PositionType, {
  name: 'PositionType', 
  description: 'Available job position types',
});
