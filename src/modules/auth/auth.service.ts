import { Injectable, BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import CommonUtil from 'src/utils/commons.util';
import { MailService } from 'apps/email/mail.service';
import { User } from '../../entities/users.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly kafkaProducer: MailService,
  ) {}

  async register(registerUserDto: RegisterDto): Promise<User> {
    const { email, password, scope } = registerUserDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const savedUser = await this.userRepository.save({ email, password, scope });

    this.kafkaProducer.sendWelcomeEmail(savedUser.email).catch((e) => {
      this.logger.warn('Email service failed:', e.message);
    });

    return savedUser;
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !(await user.isValidPassword(dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.scope !== dto.scope) {
      throw new UnauthorizedException(`Access denied for scope "${dto.scope}"`);
    }

    return user;
  }


  async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email, scope: user.scope };
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const secret = this.configService.get<string>('JWT_SECRET');

    return CommonUtil.generateToken(payload, expiresIn, secret);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const token = this.generateToken(user);
    return { user, token };
  }
}
