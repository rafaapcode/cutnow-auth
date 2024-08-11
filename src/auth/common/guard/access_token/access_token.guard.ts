import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { access_token } = request.cookies;
    if (!access_token) {
      throw new UnauthorizedException('Nenhum token encontrado');
    }

    const payload = this.jwtService.verify(access_token, {
      secret: this.config.getOrThrow('JWT_SECRET'),
    });

    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }
}
