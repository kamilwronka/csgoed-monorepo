import { DOMAIN_NAME, DASHBOARD_URL } from 'src/config/config';
import { Mail } from '../interfaces/mail.interface';
import { compile } from 'handlebars';

import { readFileSync } from 'fs';
import { resolve } from 'path';

const activationEmailTranslations = require('./translations/activation-email.json');

export const getActivationEmail = (options: Mail) => {
  const { email, metadata, name } = options;

  const template = compile(
    readFileSync(resolve(__dirname + '/files/activation-email.html')).toString(
      'utf8',
    ),
  );

  return {
    from: `${DOMAIN_NAME} <noreply@${DOMAIN_NAME}>`,
    to: `<${email}>`,
    subject: `${
      activationEmailTranslations[metadata.language].title
    } - ${DOMAIN_NAME}`,
    html: template({
      ...activationEmailTranslations[metadata.language],
      name,
      activationLink: `${DASHBOARD_URL}/auth/activate?token=${metadata.token}`,
    }),
  };
};
