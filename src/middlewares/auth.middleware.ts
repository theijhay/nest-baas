import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../users/types/expressRequest.interface';
import { UserService } from '../users/users.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        email: string;
      };

      const user = await this.userService.getUserById(decoded.id);
      req.user = user || null;
    } catch (error) {
      req.user = null;
    }

    next();
  }
}
