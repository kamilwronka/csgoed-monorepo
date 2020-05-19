import { getConfirmationEmail } from './confirmation-email.template';
import { getNewBrowserNotificationEmail } from './new-browser-notification-email.template';
import { getActivationEmail } from './activation-email.template';

export const MAIL_TEMPLATES = {
  CONFIRMATION_EMAIL: getConfirmationEmail,
  NEW_BROWSER_NOTIFICATION_EMAIL: getNewBrowserNotificationEmail,
  ACTIVATION_EMAIL: getActivationEmail,
};
