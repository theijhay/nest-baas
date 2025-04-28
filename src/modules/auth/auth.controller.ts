import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Res,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../../entities/users.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { User as CurrentUser } from 'src/utils/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { successResponse, errorResponse, transformUser } from 'src/utils/response/response-object';

@ApiTags('Authentication')
@Controller('api/user/auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.register({ ...registerDto });

    return successResponse('User registered successfully', transformUser(user));
    } catch (error) {
      return errorResponse('Registration failed', error.message);
    }
  }
  

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(loginDto);
      
      const token = await this.authService.generateToken(user);
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });


      return successResponse('Login successful', {
        ...transformUser(user),
        token,
      });
    } catch (error) {
      console.error('AuthController :: login error', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.setHeader('Authorization', ''); // Clear Authorization header

    return {
      status_code: HttpStatus.OK,
      message: 'Logout successful. Authorization header cleared. Please clear localStorage on frontend if necessary.',
    };
  }
  

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get current user', type: User })
  getMe(@CurrentUser() user: User) {
    return {
      status_code: 200,
      message: 'Authenticated user',
      data: user,
    };
  }
}
