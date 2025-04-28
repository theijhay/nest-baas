import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../entities/collection.entity';
import { Field } from '../../entities/field.entity';
import { SharedModule } from 'src/shared/shared.module';
import { User } from '../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Field]), SharedModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
