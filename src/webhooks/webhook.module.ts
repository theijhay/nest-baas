import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './webhook.entity';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { SharedModule } from 'src/shared/auth.guard.module';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Webhook]),
    SharedModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
