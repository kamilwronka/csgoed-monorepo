import { DOMAIN_NAME, DASHBOARD_URL } from 'src/config/config';
import { Mail } from '../interfaces/mail.interface';
import { compile } from 'handlebars';

import { readFileSync } from 'fs';
import { resolve } from 'path';

const confirmationEmailTranslations = require('./translations/confirmation-email.json');

export const getConfirmationEmail = (options: Mail) => {
  const { email, metadata, name } = options;

  const template = compile(
    readFileSync(
      resolve(__dirname + '/files/confirmation-email.html'),
    ).toString('utf8'),
  );

  return {
    from: `${DOMAIN_NAME} <noreply@${DOMAIN_NAME}>`,
    to: `<${email}>`,
    subject: `Account activation - ${DOMAIN_NAME}`,
    html: template({
      ...confirmationEmailTranslations[metadata.language],
      name: name,
      activationLink: `${DASHBOARD_URL}/auth/activate?token=${metadata.token}`,
    }),
  };
};
