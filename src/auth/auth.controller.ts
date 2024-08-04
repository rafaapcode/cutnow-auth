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
    const {
      data: { senha, ...info },
      message,
    } = await this.authService.signupAdmin(body);
    return { message, data: info };
  }

  @Post('signup/barber')
  async signupBarber(@Body() body: SignUpBarberDto) {
    const {
      data: { senha, ...info },
      message,
    } = await this.authService.signupBarber(body);
    return { message, data: info };
  }
}
