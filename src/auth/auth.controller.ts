import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpAdminDto, SignUpBarberDto } from './dto/auth.dto';
import { ZodValidationPipe } from './validation.pipe';
import {
  signUpAdminSchema,
  signUpBarberSchema,
} from './validation/signUpValidation.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  async loginAdmin(@Body() authPayload: LoginDto) {
    // return await this.authService.validateAdm(authPayload);
  }

  @Post('login/barber')
  async loginBarber(@Body() authPayload: LoginDto) {
    // return await this.authService.validateBarber(authPayload);
  }

  // TODO: Calcular lat e long
  @Post('signup/admin')
  @UsePipes(new ZodValidationPipe(signUpAdminSchema))
  async signupAdmin(@Body() body: SignUpAdminDto) {
    const {
      data: { senha, ...info },
      message,
    } = await this.authService.signupAdmin(body);
    return { message, data: info };
  }

  @Post('signup/barber')
  @UsePipes(new ZodValidationPipe(signUpBarberSchema))
  async signupBarber(@Body() body: SignUpBarberDto) {
    const {
      data: { senha, ...info },
      message,
    } = await this.authService.signupBarber(body);
    return { message, data: info };
  }
}
