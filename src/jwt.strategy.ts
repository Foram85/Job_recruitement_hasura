import { CandidateService } from './candidate/candidate.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Candidate } from 'candidate/entities/candidate.entity';
import { EmployeesService } from './employees/employees.service';
import { Employee } from './employees/entities/employee.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly candidateService: CandidateService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '27ccbf47f939d30265ab6b862f80a8851c2db058669f0a4b0b727b5cd2a670f9',
    });
  }
  async validate(payload: JwtPayload): Promise<Employee | Candidate> {
    const { email } = payload;
    let user: Employee | Candidate =
      await this.employeeService.findByEmail(email);
    if (!user) {
      user = await this.candidateService.findByEmail(email);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}