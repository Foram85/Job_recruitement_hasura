import { Module } from '@nestjs/common';
import { JobPositionResolver } from './job-position.resolver';
import { JobPositionService } from './job-position.service';
import { JobPosition } from './entities/job-position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DepartmentModule } from './../department/department.module';
import { EmployeesModule } from './../employees/employees.module';
import { CandidateModule } from './../candidate/candidate.module';
import { JwtStrategy } from './../jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: '27ccbf47f939d30265ab6b862f80a8851c2db058669f0a4b0b727b5cd2a670f9',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([JobPosition]),
    DepartmentModule,
    EmployeesModule,
    CandidateModule,
  ],
  providers: [JobPositionService, JobPositionResolver, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JobPositionService],
})
export class JobPositionModule {}
