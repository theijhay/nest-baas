import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { parse } from 'pg-connection-string';
import { User } from '../users/users.entity';
import { Collection } from '../collections/collection.entity';
import { Field } from '../fields/field.entity';


dotenv.config();

const dbUrl = process.env.DATABASE_URL;

const parsed = parse(dbUrl);

export default registerAs('typeorm', (): DataSourceOptions => ({
  type: 'postgres',
  host: parsed.host,
  port: parseInt(parsed.port || '5432'),
  username: parsed.user,
  password: parsed.password,
  database: parsed.database,
  synchronize: true,
  entities: [User, Collection, Field],
}));
