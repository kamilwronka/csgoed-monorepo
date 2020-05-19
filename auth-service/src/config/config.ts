import { BadRequestException } from '@nestjs/common';

export const DB_HOST = process.env.AUTH_SERVICE_DB_HOST;
export const DB_PORT = process.env.AUTH_SERVICE_DB_PORT;
export const DB_NAME = process.env.AUTH_SERVICE_DB_NAME;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

export const prod = process.env.NODE_ENV === 'production';
const DEV_WHITELIST = ['http://localhost:3000', 'http://192.168.8.130:3000'];
const PROD_WHITELIST = ['https://dashboard.csgoed.com'];

export const CORS_OPTIONS = {
  origin: (origin, callback) => {
    const whitelist = prod ? PROD_WHITELIST : DEV_WHITELIST;

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Origin not allowed by CORS'));
    }
  },
  preflightContinue: false,
};
