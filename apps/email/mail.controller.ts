import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private mailService: MailService) {}

  @MessagePattern('user.registered')
  async handleUserRegistered(@Payload() payload: { email: string }) {
    await this.mailService.sendWelcomeEmail(payload.email);
  }
}
