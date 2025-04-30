import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/entities/users.entity';
import { Collection } from 'src/entities/collection.entity';
import { Field } from 'src/entities/field.entity';
import { Webhook } from 'src/entities/webhook.entity';
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