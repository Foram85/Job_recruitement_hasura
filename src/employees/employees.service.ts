import { EmailService } from './../email/email.service';
import { TokenType } from './../token/token.entity';
import { TokenService } from './../token/token.service';
import { DepartmentService } from './../department/department.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeInput } from './dto/create-employee.input';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UpdateEmployeeInput } from './dto/update-employee.input';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  hasura_claims: {
    "x-hasura-user-id": string;
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
    "x-hasura-role": string;
  };
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private departmentRepository: DepartmentService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private emailService: EmailService,
  ) {}

  private accessToken(employee: Employee): string {
    const payload: JwtPayload = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      hasura_claims: {
        "x-hasura-user-id": employee.id,
        "x-hasura-default-role": "employee",
        "x-hasura-allowed-roles": ["employee", "hr", "recruiter", "interviewer", "hiring_manager"],
        "x-hasura-role": employee.role,
      },
    };
  
    return this.jwtService.sign(payload); 
  }  

  async findByEmail(email: string): Promise<Employee> {
    return await this.employeeRepository.findOne({ where: { email } });
  }

  async addEmployee(createDto: CreateEmployeeInput): Promise<Employee> {
    const existingEmp = await this.employeeRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingEmp) {
      throw new ConflictException('This employee already exists');
    }

    const department = await this.departmentRepository.findOneById(
      createDto.departmentId,
    );
    if (!department) {
      throw new ConflictException('Department not found');
    }

    const employee = this.employeeRepository.create({
      ...createDto,
      department,
      password: null,
    });

    const savedEmployee = await this.employeeRepository.save(employee);

    const token = await this.tokenService.generateToken(
      employee.email,
      employee.name,
      TokenType.EMPLOYEE,
      savedEmployee,
    );

    await this.emailService.sendInvitation(
      employee.email,
      employee.name,
      token.token,
    );

    return savedEmployee;
  }

  async login(
    email: string,
    Token: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const token = await this.tokenService.findValidToken(Token);
    if (token) {
      const employee = token.employee;
      employee.password = await bcrypt.hash(password, 10);
      employee.isActive = true;
      await this.employeeRepository.save(employee);
      await this.tokenService.deleteToken(token.token);

      return { accessToken: this.accessToken(employee) };
    }
    const Employee = await this.findByEmail(email);
    if (Employee.password) {
      const isPasswordValid = await bcrypt.compare(password, Employee.password);
      if (!isPasswordValid || Employee.email !== email) {
        throw new UnauthorizedException('Invalid credentials or token');
      }
      return { accessToken: this.accessToken(Employee) };
    }
  }

  async forgotPassword(id: string): Promise<void> {
    const employee = await this.getById(id);
    if (!employee) {
      throw new NotFoundException('employee not found');
    }

    const token = await this.tokenService.generateToken(
      employee.email,
      employee.name,
      TokenType.EMPLOYEE,
      employee,
      48,
    );

    await this.emailService.sendResetPasswordEmail(
      employee.email,
      employee.name,
      token.token,
    );
  }

  async getAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async getById(id: string): Promise<Employee> {
    const emp = this.employeeRepository.findOneBy({ id });
    if (!emp) {
      throw new NotFoundException('employee not found');
    }
    return emp;
  }

  async updateById(
    id: string,
    updateDto: UpdateEmployeeInput,
  ): Promise<Employee> {
    const employee = await this.getById(id);
    Object.assign(employee, updateDto);
    return this.employeeRepository.save(employee);
  }

  async deleteById(id: string) {
    return this.employeeRepository.delete({ id });
  }
}
