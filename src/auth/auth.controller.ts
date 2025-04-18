import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UnauthorizedException, 
  BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/users.entity';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  @HttpCode(HttpStatus.CREATED
  )
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerUserDto: RegisterDto) {
    try {
      const user: User = await this.authService.register(registerUserDto);

      return {
        status_code: 201,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          is_active: user.is_active,
          is_verified: user.is_verified,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

   // User Login Endpoint
   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiResponse({
     status: 200,
     description: 'Login successful',
   })
   @ApiResponse({ status: 401, description: 'Invalid credentials' })
   @ApiResponse({ status: 400, description: 'Bad Request' })
   async login(
    @Body() loginDto: LoginDto) {
     try {
       // Authenticate the user and get tokens
       const loginResponse = await this.authService.login(loginDto);
 
       return {
         status_code: HttpStatus.OK,
         message: 'Login successful',
         data: loginResponse,
       };
     } catch (error) {
       console.error('UserController :: login error', error);
       if (error instanceof UnauthorizedException) {
         throw new UnauthorizedException('Invalid credentials');
       } else {
        throw new BadRequestException({
          status_code: 400,
          message: `User with email ${loginDto.email} does not exist`,
        });
       }
     }
   }
 }
