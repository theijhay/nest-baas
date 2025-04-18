import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../collections/collection.entity';
import { WebhookModule } from 'src/webhooks/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    WebhookModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
