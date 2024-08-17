import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { HashPasswordService } from '../hash-password/hash-password.service';
import { LoginDto, SignUpAdminDto, SignUpBarberDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashPasswordService: HashPasswordService,
    private readonly geolocationService: GeolocationService,
    private readonly databaseService: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async loginBarber(barbeiro: LoginDto) {
    try {
      const barber = await this.databaseService.findBarber(barbeiro.email);
      const isValidPassword = await this.hashPasswordService.compare(
        barber.senha,
        barbeiro.password,
      );

      if (!isValidPassword) {
        throw new BadRequestException('Senha incorreta');
      }

      const payload = {
        id: barber.id,
        email: barber.email,
      };

      const { senha, ...info } = barber;

      const access_token = this.jwtService.sign(payload, {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '2h',
      });
      const refresh_token = this.jwtService.sign(payload, {
        secret: this.config.getOrThrow('REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return { access_token, refresh_token, payload: info };
    } catch (error) {
      console.log(error.message);
      if (error.message == 'Senha incorreta') {
        throw new BadRequestException('Senha incorreta');
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async loginAdmin(admin: LoginDto) {
    try {
      const barbearia = await this.databaseService.findBarbershop(admin.email);
      const isValidPassword = await this.hashPasswordService.compare(
        barbearia.senha,
        admin.password,
      );

      if (!isValidPassword) {
        throw new BadRequestException('Senha incorreta');
      }

      const payload = {
        id: barbearia.id,
        email: barbearia.email,
      };

      const { senha, latitude, longitude, ...info } = barbearia;
      const access_token = this.jwtService.sign(payload, {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '2h',
      });
      const refresh_token = this.jwtService.sign(payload, {
        secret: this.config.getOrThrow('REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return { access_token, refresh_token, payload: info };
    } catch (error) {
      console.log(error.message);
      if (error.message == 'Senha incorreta') {
        throw new BadRequestException('Senha incorreta');
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.getOrThrow('REFRESH_SECRET'),
      });

      if (!payload) {
        throw new BadRequestException('Invalid Token');
      }
      const newPayload = {
        id: payload.id,
        email: payload.email,
      };
      const access_token = this.jwtService.sign(newPayload, {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: '2h',
      });
      const refresh_token = this.jwtService.sign(newPayload, {
        secret: this.config.getOrThrow('REFRESH_SECRET'),
        expiresIn: '7d',
      });
      return { access_token, refresh_token };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signupBarber(barber: SignUpBarberDto) {
    try {
      const barberExist = await this.databaseService.findUniqueBarber(
        barber.email,
        barber.cpf,
      );

      if (barberExist) {
        throw new HttpException('Barbeiro já existe', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.hashPasswordService.hash(barber.senha);
      const data = await this.databaseService.createBarber(
        barber,
        hashedPassword,
      );

      return { message: 'Barbeiro criado com sucesso !', data };
    } catch (err) {
      if (err.message === 'Barbeiro já existe') {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Erro Interno',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async signupAdmin(admin: SignUpAdminDto) {
    try {
      const adminExist = await this.databaseService.findUniqueBarbershop(
        admin.email,
        admin.nomeDaBarbearia,
        admin.cnpj,
      );
      if (adminExist) {
        throw new HttpException('Barbearia já existe', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.hashPasswordService.hash(admin.senha);
      const dataResponse = await this.geolocationService.getLatAndLong({
        bairro: admin.informacoes.bairro,
        cep: admin.informacoes.cep,
        cidade: admin.informacoes.cidade,
        estado: admin.informacoes.estado,
        numero: admin.informacoes.numero,
        rua: admin.informacoes.rua,
      });

      const { lat, lng } = dataResponse.geometry.location;

      const data = await this.databaseService.createBarbershop(
        admin,
        hashedPassword,
        `${lat}`,
        `${lng}`,
      );

      return { message: 'Barbearia criada com sucesso !', data };
    } catch (err) {
      if (err.message === 'Barbearia já existe') {
        throw new HttpException('Barbearia já existe', HttpStatus.BAD_REQUEST);
      }
      console.log(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async verifyBarbershop(
    email: string,
    nomeDaBarbearia: string,
    cnpj: string,
  ): Promise<{ status: boolean; message?: string }> {
    const barbeariaExists = await this.databaseService.verfifyBarbershop(
      email,
      nomeDaBarbearia,
      cnpj,
    );
    return barbeariaExists;
  }
}
