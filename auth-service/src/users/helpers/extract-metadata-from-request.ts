import { AuthHistory } from '../schemas/auth-history.schema';
import { Request } from 'express';
import axios from 'axios';
import { prod } from 'src/config/config';

export const extractMetadataFromRequest = async (
  req: Request,
  fingerprint: string,
): Promise<AuthHistory> => {
  console.log(req.headers['x-forwarded-for']);
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

  try {
    let localizationResponse = await axios.get(
      'https://signals.api.auth0.com/v2.0/ip/' + ip,
      {
        headers: {
          'x-auth-token': process.env.IP_LOCALIZATION_API_KEY,
        },
      },
    );

    let localization = localizationResponse.data['geo'].country;

    return {
      ip,
      localization,
      device,
      date: new Date().toISOString(),
      fingerprint,
    };
  } catch (error) {
    return {
      ip: 'unknown',
      localization: 'unknown',
      device,
      date: new Date().toISOString(),
      fingerprint,
    };
  }
};
