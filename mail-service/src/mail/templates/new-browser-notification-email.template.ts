import { DOMAIN_NAME, DASHBOARD_URL } from 'src/config/config';
import { Mail } from '../interfaces/mail.interface';
import { compile } from 'handlebars';

import { readFileSync } from 'fs';
import { resolve } from 'path';

const securityAlertEmailTemplate = require('./translations/security-alert.json');

export const getNewBrowserNotificationEmail = (options: Mail) => {
  const { email, metadata } = options;

  const template = compile(
    readFileSync(
      resolve(__dirname + '/files/security-alert-email.html'),
    ).toString('utf8'),
  );

  return {
    from: `${DOMAIN_NAME} <noreply@${DOMAIN_NAME}>`,
    to: `<${email}>`,
    subject: `${
      securityAlertEmailTemplate[metadata.language].title
    } - ${DOMAIN_NAME}`,
    html: template({
      ...securityAlertEmailTemplate[metadata.language],
      device: metadata.details.device,
      checkActivityPageLink: `${DASHBOARD_URL}/account/security/active-sessions`,
    }),
  };
};
