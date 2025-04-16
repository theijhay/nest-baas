import { 
  Injectable,
  BadRequestException, 
  HttpException,
  HttpStatus, 
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

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

    // Register a new user
    async register(registerUserDto: RegisterDto): Promise<User> {
      const { email, password } = registerUserDto;
  
      // Check if the email is already registered
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }
  
      // Hash the password before saving
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = this.userRepository.create({
        email,
        password,
      });
  
      // Save the user to the database
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    }
  

  // Login a user
  async Login(dto: LoginDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is already registered
    return this.generateToken(user);
  }

  // Generate JWT token
  private generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }


async login(payload: LoginDto) {
    
  try {
    console.log("Payload: ", payload);

    // Check if user exists
    const user = await this.usersService.getUserByEmail(payload.email);
    if (!user) {
      throw new HttpException(
        `User with email: ${payload.email} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate password
    const isValid = await user.isValidPassword(payload.password);
    console.log("isValid: ", isValid);
    if (!isValid) {
      throw new HttpException("Incorrect email or password", HttpStatus.BAD_REQUEST);
    }

    // Generate token using CommonUtil
    const expiresIn = this.configService.getOrThrow("JWT_EXPIRES_IN");
    const secretKey = this.configService.getOrThrow("JWT_SECRET");
    const token = await CommonUtil.generateToken({ id: user.id }, expiresIn, secretKey);

    // Return user and token
    return { 
      user: {
        id: user.id,
        email: user.email,
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: new Date(),
      },
      token 
    };
  } catch (error) {
    console.error("authservice :: login error \n %o", error);
    throw error;
  }
}
}