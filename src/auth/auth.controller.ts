import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('login/admin')
  async loginAdmin(@Body() authPayload: AuthPayloadDto) {}
}
