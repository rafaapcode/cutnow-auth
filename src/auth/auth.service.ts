import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { HashPasswordService } from '../hash-password/hash-password.service';
import { SignUpAdminDto, SignUpBarberDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashPasswordService: HashPasswordService,
    private readonly geolocationService: GeolocationService,
    private readonly databaseService: DatabaseService,
  ) {}

  async loginBarber() {}

  async loginAdmin() {}

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
}
