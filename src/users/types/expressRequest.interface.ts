import { Request } from 'express';
import { User } from '../../users/users.entity';

export interface ExpressRequest extends Request {
  user?: User | null;
}
