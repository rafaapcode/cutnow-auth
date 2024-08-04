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

      const data = await this.prismaService.barbeiro.create({
        data: barber,
      });

      return { message: 'Usuário criado com sucesso !', data };
    } catch (err) {
      console.log(err.message);
      throw new HttpException('Erro Interno', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      this.prismaService.$disconnect();
    }
  }
  async signupAdmin(admin: AdminEntity) {}
}
