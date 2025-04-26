import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
  
    // First try to get token from cookie
    let token = request.cookies?.jwt;
  
    // If not found, try to get it from Authorization header
    if (!token) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
  
    if (!token) throw new UnauthorizedException('No authentication token provided');
  
    let decoded: any;
  
    try {
      decoded = jwt.verify(token, this.config.get<string>('JWT_SECRET'));
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  
    // Extract route scope from the URL
  const url = request.originalUrl;
  // Split the URL into parts and filter out empty segments
  const urlParts = url.split('/').filter(Boolean);
  // Find the index of the 'api' segment
  const apiIndex = urlParts.indexOf('api');
  // Get the next segment after 'api' as the route scope
  const routeScope = apiIndex !== -1 ? urlParts[apiIndex + 1] : undefined;

  // Extract scope from the decoded token
  if (!routeScope || decoded.scope !== routeScope) {
    throw new UnauthorizedException('Access denied: invalid scope');
  }
  
    const user = await this.userRepo.findOne({ where: { id: decoded.id } });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    request.user = user;
    return true;
  }
}  