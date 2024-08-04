import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthPayloadDto,
  SignUpAdminDto,
  SignUpBarberDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  async loginAdmin(@Body() authPayload: AuthPayloadDto) {
    // return await this.authService.validateAdm(authPayload);
  }

  @Post('login/barber')
  async loginBarber(@Body() authPayload: AuthPayloadDto) {
    // return await this.authService.validateBarber(authPayload);
  }

  @Post('signup/admin')
  async signupAdmin(@Body() body: SignUpAdminDto) {
    // return await this.authService.validateAdm(authPayload);
  }

  @Post('signup/barber')
  async signupBarber(@Body() body: SignUpBarberDto) {
    // return await this.authService.validateBarber(authPayload);
    return await this.signupBarber(body);
  }
}
