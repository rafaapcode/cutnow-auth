import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WrapResponseInterceptor } from './common/interceptor/wrap-response.interceptor';
import { LoginDto, SignUpAdminDto, SignUpBarberDto } from './dto/auth.dto';
import { ZodValidationPipe } from './validation.pipe';
import { LoginSchema } from './validation/loginValidation.schema';
import {
  signUpAdminSchema,
  signUpBarberSchema,
} from './validation/signUpValidation.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async loginAdmin(@Body() authPayload: LoginDto) {
    const { access_token, refresh_token } =
      await this.authService.loginAdmin(authPayload);
    return {
      message: 'Bem-Vindo !',
      access_token,
      refresh_token,
    };
  }

  @Post('login/barber')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async loginBarber(@Body() authPayload: LoginDto) {
    const { access_token, refresh_token } =
      await this.authService.loginBarber(authPayload);
    return {
      message: 'Bem-Vindo !',
      access_token,
      refresh_token,
    };
  }

  @Post('signup/admin')
  @UsePipes(new ZodValidationPipe(signUpAdminSchema))
  @UseInterceptors(new WrapResponseInterceptor())
  async signupAdmin(@Body() body: SignUpAdminDto) {
    const res = await this.authService.signupAdmin(body);
    return res;
  }

  @Post('signup/barber')
  @UsePipes(new ZodValidationPipe(signUpBarberSchema))
  @UseInterceptors(new WrapResponseInterceptor())
  async signupBarber(@Body() body: SignUpBarberDto) {
    const res = await this.authService.signupBarber(body);
    return res;
  }
}
