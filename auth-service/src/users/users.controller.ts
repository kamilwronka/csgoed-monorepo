import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getUser(@Request() req) {
    return req.user;
  }
}
