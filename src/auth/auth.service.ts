import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashPasswordService } from 'src/hash-password/hash-password.service';
import { PrismaService } from 'src/prisma.service';
import { AdminEntity } from './entities/Admin.entity';
import { BarberEntity } from './entities/Barber.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashPasswordService: HashPasswordService,
    private readonly prismaService: PrismaService,
  ) {}

  async signupBarber(barber: BarberEntity) {
    try {
      const barberExist = await this.prismaService.barbeiro.findUnique({
        where: {
          email: barber.email,
        },
      });

      if (barberExist) {
        throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await this.hashPasswordService.hash(barber.senha);
      const data = await this.prismaService.barbeiro.create({
        data: {
          ...barber,
          senha: hashedPassword,
        },
      });

      return { message: 'Usuário criado com sucesso !', data };
    } catch (err) {
      console.log(err.message);
      if (err.message === 'Barbearia já existe') {
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
  async signupAdmin(admin: AdminEntity) {
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
        },
      });

      return { message: 'Barbearia criada com sucesso !', data };
    } catch (err) {
      console.log(err.message);
      if (err.message === 'Barbearia já existe') {
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
}
