import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(email: string) {
    const info = await this.transporter.sendMail({
      from: '"Nest BaaS 👻" <no-reply@nestbaas.io>',
      to: email,
      subject: 'Welcome to Nest BaaS!',
      text: `Hi 👋, thanks for signing up.`,
      html: `<h3>Welcome to Nest BaaS!</h3><p>We're glad to have you 🎉</p>`,
    });

    this.logger.log(`📨 Email sent to ${email} (messageId: ${info.messageId})`);
  }
}
