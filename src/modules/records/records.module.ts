import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../entities/collection.entity';
import { WebhookModule } from 'src/modules/webhooks/webhook.module';
import { SharedModule } from 'src/shared/shared.module';
import { User } from '../../entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Collection]),
    WebhookModule,
    SharedModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
