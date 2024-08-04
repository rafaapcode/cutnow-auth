import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashPasswordService } from 'src/hash-password/hash-password.service';
import { PrismaService } from 'src/prisma.service';
import { SignUpAdminDto, SignUpBarberDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashPasswordService: HashPasswordService,
    private readonly prismaService: PrismaService,
  ) {}

  async loginBarber() {}

  async loginAdmin() {}

  async signupBarber(barber: SignUpBarberDto) {
    try {
      const barberExist = await this.prismaService.barbeiro.findUnique({
        where: {
          email: barber.email,
        },
      });

      if (barberExist) {
        throw new HttpException('Barbeiro já existe', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await this.hashPasswordService.hash(barber.senha);
      const data = await this.prismaService.barbeiro.create({
        data: {
          ...barber,
          senha: hashedPassword,
        },
      });

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
    } finally {
      await this.prismaService.$disconnect();
    }
  }
  async signupAdmin(admin: SignUpAdminDto) {
    try {
      const adminExist = await this.prismaService.barbearia.findUnique({
        where: {
          email: admin.email,
        },
      });

      if (adminExist) {
        throw new HttpException('Barbearia já existe', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.hashPasswordService.hash(admin.senha);
      const data = await this.prismaService.barbearia.create({
        data: {
          ...admin,
          senha: hashedPassword,
          latitude: '',
          longitude: '',
        },
      });

      return { message: 'Barbearia criada com sucesso !', data };
    } catch (err) {
    } finally {
      await this.prismaService.$disconnect();
    }
  }
}
