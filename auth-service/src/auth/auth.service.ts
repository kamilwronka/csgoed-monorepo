import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { sign, verify } from 'jsonwebtoken';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const result = await bcrypt.compare(password, user.password);
    return result ? user : null;
  }

  async validateUserByJwt(email: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };

    return {
      accessToken: sign(payload, jwtConstants.secret, {
        expiresIn: jwtConstants.expiresIn,
      }),
      refreshToken: sign(payload, jwtConstants.refreshSecret, {
        expiresIn: jwtConstants.refreshExpiresIn,
      }),
      expires: jwtConstants.expiresIn,
      refreshExpires: jwtConstants.refreshExpiresIn,
      refreshTokenUuid: uuid.v4(),
      accessTokenUuid: uuid.v4(),
    };
  }

  async refreshToken(bearerToken: string) {
    const token = bearerToken.replace('Bearer ', '');

    try {
      const payload = verify(token, jwtConstants.refreshSecret, {
        ignoreExpiration: false,
      });

      return this.login({ email: payload['email'], _id: payload['sub'] });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
