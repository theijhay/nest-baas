import { Request } from 'express';
import { User } from '../../../entities/users.entity';

export interface ExpressRequest extends Request {
  user?: User | null;
}
