import { 
  Injectable,
  BadRequestException, 
  Logger,
  UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { UserService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import CommonUtil from '../utils/commons.util';
import { MailService } from 'apps/email/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly kafkaProducer: MailService,
  ) {}

  async register(registerUserDto: RegisterDto): Promise<User> {
    const { email, password, scope } = registerUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const newUser = this.userRepository.create({ email, password, scope });
    const savedUser = await this.userRepository.save(newUser);

    this.kafkaProducer.sendWelcomeEmail(savedUser.email).catch((e) => {
      this.logger.warn('Email service failed: ', e.message);
    });
    
    return savedUser;
  }

  /**
   * NEW: Validates the user's credentials and scope.
   */
  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await user.isValidPassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.scope !== dto.scope) {
      throw new UnauthorizedException(`Access denied for scope "${dto.scope}"`);
    }

    return user;
  }

  /**
   * NEW: Generates a JWT token for the user.
   */
  public generateToken(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      scope: user.scope,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * NEW: Handles user login and token generation.
   */
  async login(payload: LoginDto): Promise<{ user: any; token: string }> {
    const user = await this.usersService.getUserByEmail(payload.email);
    if (!user || !(await user.isValidPassword(payload.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expiresIn = this.configService.getOrThrow("JWT_EXPIRES_IN");
    const secretKey = this.configService.getOrThrow("JWT_SECRET");

    const tokenPayload = {
      id: user.id,
      email: user.email,
      scope: user.scope,
    };

    const token = await CommonUtil.generateToken(tokenPayload, expiresIn, secretKey);

    return {
      user: {
        id: user.id,
        email: user.email,
        scope: user.scope,
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: new Date(),
      },
      token,
    };
  }
}
