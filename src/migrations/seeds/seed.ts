import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { User } from '../../entities/users.entity';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('SeedScript');

  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);

  // Clear old data (optional in dev)
  await userRepo.delete({});

  const user = userRepo.create({
    email: 'admin@example.com',
    password: 'password123', // this Will be hashed automatically via @BeforeInsert
  });

  await userRepo.save(user);

  logger.log('✅ User seeded: admin@example.com');
  await app.close();
}

bootstrap();
