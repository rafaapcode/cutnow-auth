import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { SignUpAdminDto } from './dto/signUpAdmin.dto';
import { SignUpBarberDto } from './dto/signUpBarber.dto';

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
    // return await this.signupAdmin(body);
    const {
      data: { senha, ...info },
      message,
    } = await this.authService.signupAdmin(body);
    return { message, data: info };
  }

  @Post('signup/barber')
  async signupBarber(@Body() body: SignUpBarberDto) {
    // return await this.authService.validateBarber(authPayload);
    return await this.signupBarber(body);
  }
}
