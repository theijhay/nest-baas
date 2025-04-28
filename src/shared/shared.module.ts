import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Collection } from '../entities/collection.entity';
import { Field } from '../entities/field.entity';
import { Webhook } from '../entities/webhook.entity';
import { UserRepository } from '../repositories/user.repository';
import { CollectionRepository } from '../repositories/collection.repository';
import { FieldRepository } from '../repositories/field.repository';
import { WebhookRepository } from '../repositories/webhook.repository';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Field, Webhook])],
  providers: [
    UserRepository,
    CollectionRepository,
    FieldRepository,
    WebhookRepository,
    AuthGuard,
  ],
  exports: [
    UserRepository,
    CollectionRepository,
    FieldRepository,
    WebhookRepository,
    AuthGuard,
  ],
})
export class SharedModule {}
