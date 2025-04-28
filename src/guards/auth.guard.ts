import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // First try to get token from cookie
    let token = request.cookies?.jwt;

    // If not found, try Authorization header
    if (!token) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, this.config.get<string>('JWT_SECRET'));
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Extract scope from route
    const url = request.originalUrl;
    const urlParts = url.split('/').filter(Boolean);
    const apiIndex = urlParts.indexOf('api');
    const routeScope = apiIndex !== -1 ? urlParts[apiIndex + 1] : undefined;

    if (!routeScope || decoded.scope !== routeScope) {
      throw new UnauthorizedException('Access denied: invalid scope');
    }

    const user = await this.userRepo.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    return true;
  }
}
