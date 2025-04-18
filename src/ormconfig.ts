import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

import { User } from './users/users.entity';
import { Collection } from './collections/collection.entity';
import { Field } from './fields/field.entity';
import { Webhook } from './webhooks/webhook.entity';

dotenv.config();
const parsed = parse(process.env.DATABASE_URL!);

export default new DataSource({
  type: 'postgres',
  host: parsed.host,
  port: parseInt(parsed.port || '5432'),
  username: parsed.user,
  password: parsed.password,
  database: parsed.database,

  synchronize: false,
  entities: [User, Collection, Field, Webhook],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
