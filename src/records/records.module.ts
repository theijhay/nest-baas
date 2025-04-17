import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../collections/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
