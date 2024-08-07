import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
  async loginAdmin(@Body() authPayload: LoginDto, @Res() response: Response) {
    const { access_token, refresh_token } =
      await this.authService.loginAdmin(authPayload);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });

    return response.status(200).json({
      message: 'Bem-Vindo !',
      signedIn: true,
    });
  }

  @Post('login/barber')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async loginBarber(@Body() authPayload: LoginDto, @Res() response: Response) {
    const { access_token, refresh_token } =
      await this.authService.loginBarber(authPayload);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });

    return response.status(200).json({
      message: 'Bem-Vindo !',
      signedIn: true,
    });
  }

  @Get('barber')
  async refreshBarber(@Req() request: Request) {
    const { refresh_token: refreshToken } = request.cookies;
    const { access_token, refresh_token } =
      await this.authService.refreshBarber(refreshToken);

    return {
      message: 'Tokens Atualizados com sucesso!',
      access_token,
      refresh_token,
    };
  }

  @Get('admin')
  async refreshBarbershop(@Req() request: Request) {
    const { refresh_token: refreshToken } = request.cookies;
    const { access_token, refresh_token } =
      await this.authService.refreshBarbershop(refreshToken);

    return {
      message: 'Tokens Atualizados com sucesso!',
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
