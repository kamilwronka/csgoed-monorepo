import { BadRequestException } from '@nestjs/common';

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

const prod = process.env.NODE_ENV === 'production';
const DEV_WHITELIST = ['http://localhost:3000'];
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
