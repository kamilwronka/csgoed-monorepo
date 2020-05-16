import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      return user;
    }
    return null;
  }

  async validateUserByJwt(email: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      return;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
