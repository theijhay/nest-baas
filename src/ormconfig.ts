import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/users.entity';
import { Collection } from './collections/collection.entity';
import { Field } from './fields/field.entity';
import { Webhook } from './webhooks/webhook.entity';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const parsed = parse(dbUrl);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: parsed.host,
  port: parseInt(parsed.port || '5432'),
  username: parsed.user,
  password: parsed.password,
  database: parsed.database,
  synchronize: false,
  entities: [
    User, 
    Collection, 
    Field, 
    Webhook],
  migrations: ['src/migrations/*.ts'],
};

const ormConfig = new DataSource(dataSourceOptions);

export default ormConfig;