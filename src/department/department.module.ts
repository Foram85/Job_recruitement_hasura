import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'Shah$123',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([Department]),
  ],
  providers: [DepartmentService, DepartmentResolver],
  exports: [DepartmentService],
})
export class DepartmentModule {}
