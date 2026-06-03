import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() request: Request) {
    const user = (request as any).user;

    return {
      message: 'This is a protected endpoint!',
      claims: {
        sub: user.sub,
        email: user.email,
        email_verified: user.email_verified,
        name: user.name,
        iss: user.iss,
        aud: user.aud,
      },
    };
  }
}
