import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Barbeiro } from '@prisma/client';
import { SignUpBarberDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUniqueBarber(email: string): Promise<Barbeiro> {
    try {
      const barber = await this.prismaService.barbeiro.findUnique({
        where: {
          email,
        },
      });

      return barber;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createBarber(
    barber: SignUpBarberDto,
    hashedPassword: string,
  ): Promise<Barbeiro> {
    try {
      const data = await this.prismaService.barbeiro.create({
        data: {
          ...barber,
          senha: hashedPassword,
        },
      });

      return data;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
