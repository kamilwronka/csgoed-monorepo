import { AuthHistory } from '../schemas/auth-history.schema';
import { Request } from 'express';
import axios from 'axios';
import { prod } from 'src/config/config';

export const extractMetadataFromRequest = async (
  req: Request,
  fingerprint: string,
): Promise<AuthHistory> => {
  console.log(req.headers);
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let device = req.headers['user-agent'];

  if (!prod) {
    return {
      ip: 'localhost',
      localization: 'local',
      device,
      date: new Date().toISOString(),
      fingerprint,
    };
  }

  return {
    ip,
    localization: req.headers['cf-ipcountry'],
    device,
    date: new Date().toISOString(),
    fingerprint,
  };
};
