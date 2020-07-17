import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('MAIL_SERVICE_CONFIRMATION_EMAIL')
  async sendConfirmationEmail(payload) {
    this.mailService.sendEmail({ ...payload, type: 'CONFIRMATION_EMAIL' });
  }

  @EventPattern('NEW_BROWSER_NOTIFICATION_EMAIL')
  async sendNewBrowserNotificationEmail(payload) {
    this.mailService.sendEmail({
      ...payload,
      type: 'NEW_BROWSER_NOTIFICATION_EMAIL',
    });
  }

  @EventPattern('MAIL_SERVICE_ACTIVATION_EMAIL')
  async sendActivationEmail(payload) {
    this.mailService.sendEmail({
      ...payload,
      type: 'ACTIVATION_EMAIL',
    });
  }
}
