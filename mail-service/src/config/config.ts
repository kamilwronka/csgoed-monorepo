export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const MAILGUN_HOST = process.env.MAILGUN_HOST;
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
export const DOMAIN_NAME = process.env.DOMAIN_NAME;
export const DASHBOARD_URL =
  process.env.DASHBOARD_URL || 'http://localhost:3000';

const prod = process.env.NODE_ENV === 'production';
