import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection.entity';
import { Field } from '../fields/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Field])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
