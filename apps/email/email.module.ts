import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [MailController],
  providers: [MailService],
})
export class EmailModule {}
