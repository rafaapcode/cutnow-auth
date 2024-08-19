import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
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
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const access_token = request.headers.authorization;
      if (!access_token) {
        throw new UnauthorizedException('Nenhum token encontrado');
      }

      const payload = this.jwtService.verify(access_token, {
        secret: this.config.getOrThrow('JWT_SECRET'),
      });

      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      if (payload.role !== 'admin') {
        throw new NotAcceptableException(
          'Você não possui permissões para acessar essa rota',
        );
      }

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
