import { CandidateModule } from './../candidate/candidate.module';
import { TokenModule } from './../token/token.module';
import { EmailModule } from './../email/email.module';
import { JwtStrategy } from './../jwt.strategy';
import { DepartmentModule } from './../department/department.module';
import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesResolver } from './employees.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: '27ccbf47f939d30265ab6b862f80a8851c2db058669f0a4b0b727b5cd2a670f9',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Employee]),
    DepartmentModule,
    CandidateModule,
    EmailModule,
    TokenModule,
  ],
  providers: [EmployeesService, EmployeesResolver, JwtStrategy],
  exports: [JwtStrategy, PassportModule, EmployeesService],
})
export class EmployeesModule {}
