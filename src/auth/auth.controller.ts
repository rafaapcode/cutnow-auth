import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './common/guard/access_token/access_token.guard';
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
    const { access_token, refresh_token, payload } =
      await this.authService.loginAdmin(authPayload);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '*',
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '*',
    });

    return response.status(200).json({
      message: 'Bem-Vindo !',
      signedIn: true,
      data: payload,
    });
  }

  @Post('login/barber')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async loginBarber(@Body() authPayload: LoginDto, @Res() response: Response) {
    const { access_token, refresh_token, payload } =
      await this.authService.loginBarber(authPayload);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '*',
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '*',
    });

    return response.status(200).json({
      message: 'Bem-Vindo !',
      signedIn: true,
      data: payload,
    });
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.headers.authorization;
    const { access_token, refresh_token } =
      await this.authService.refresh(refreshToken);
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return {
      message: 'Tokens Atualizados com sucesso!',
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
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(signUpBarberSchema))
  @UseInterceptors(new WrapResponseInterceptor())
  async signupBarber(@Body() body: SignUpBarberDto) {
    const res = await this.authService.signupBarber(body);
    return res;
  }

  @Get('findBarbershopByEmail/:email')
  async findBarbershopByEmail(@Param('email') email: string) {
    const barbershop = await this.authService.verifyBarbershopByEmail(email);

    return barbershop;
  }

  @Get('findBarbershopByName/:name')
  async findBarbershopByName(@Param('name') name: string) {
    const barbershop = await this.authService.verifyBarbershopByName(name);

    return barbershop;
  }

  @Get('findBarbershopByCnpj/:cnpj')
  async findBarbershopByCnpj(@Param('cnpj') cnpj: string) {
    const barbershop = await this.authService.verifyBarbershopByCnpj(cnpj);

    return barbershop;
  }
}
