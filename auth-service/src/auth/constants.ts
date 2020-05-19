export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  refreshSecret: process.env.REFRESH_SECRET || 'refreshSecretKey',
  expiresIn: '1m',
  refreshExpiresIn: '7d',
};
