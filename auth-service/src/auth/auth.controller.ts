import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignUpUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }
}
