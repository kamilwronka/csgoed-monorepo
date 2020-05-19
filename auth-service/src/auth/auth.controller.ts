import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() body: SignUpUserDto, @Request() req) {
    const user = await this.usersService.create(body, req);
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req, @Body() body: SignInUserDto) {
    const user = await this.usersService.updateLoginData(body, req);
    return this.authService.login(user);
  }

  @Get('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.headers.authorization);
  }

  @Post('activate')
  async activateAccount(@Body() body: ActivateUserDto) {
    return this.usersService.activateUser(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-activation-email')
  async resendActivationEmail(@Request() req) {
    return this.usersService.resendActivationEmail(req.user);
  }
}
