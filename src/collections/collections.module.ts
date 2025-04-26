import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection.entity';
import { Field } from '../fields/field.entity';
import { SharedModule } from 'src/shared/auth.guard.module';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Field]), SharedModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
