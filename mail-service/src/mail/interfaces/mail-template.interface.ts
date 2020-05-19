import * as mailgun from 'mailgun-js';

export interface MailTemplate {
  to: string;
  from: string;
  html?: string;
  text?: string;
  subject: string;
  attachment?: mailgun.Attachment;
}
