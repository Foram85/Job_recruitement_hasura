import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CandidateService } from './candidate/candidate.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CandidateGuard implements CanActivate {
  constructor(private candidateService: CandidateService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Candidate is not authenticated');
    }
    const candidate = await this.candidateService.findOneById(userId);

    if (!candidate) {
      throw new UnauthorizedException(
        'Only candidates can perform this action',
      );
    }

    request.candidate = candidate; // Attach candidate to request
    return true;
  }
}
