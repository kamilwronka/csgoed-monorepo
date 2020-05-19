import { Injectable, Logger } from '@nestjs/common';
import { Mail } from './interfaces/mail.interface';
import * as mailgun from 'mailgun-js';
import {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_HOST,
} from 'src/config/config';
import { MailTemplate } from './interfaces/mail-template.interface';
import { MAIL_TEMPLATES } from './templates/mail.templates';

@Injectable()
export class MailService {
  mailer;

  constructor() {
    this.mailer = mailgun({
      apiKey: MAILGUN_API_KEY,
      domain: MAILGUN_DOMAIN,
      host: MAILGUN_HOST,
    });
  }

  async getEmailTemplate(options: Mail): Promise<MailTemplate> {
    return MAIL_TEMPLATES[`${options.type}`](options);
  }

  async sendEmail(options: Mail): Promise<void> {
    const template = await this.getEmailTemplate(options);

    this.mailer.messages().send(template, function(error) {
      if (error) {
        Logger.error(error);
      }
    });
  }
}
