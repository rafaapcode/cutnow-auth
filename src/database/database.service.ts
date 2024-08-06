import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Barbearia, Barbeiro } from '@prisma/client';
import { SignUpAdminDto, SignUpBarberDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUniqueBarber(email: string, cpf: string): Promise<Barbeiro> {
    try {
      const barber = await this.prismaService.barbeiro.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              cpf,
            },
          ],
        },
      });

      return barber;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async findBarber(email: string): Promise<Barbeiro> {
    try {
      const barber = await this.prismaService.barbeiro.findUnique({
        where: {
          email,
        },
      });

      if (!barber) {
        throw new NotFoundException('Barbeiro não encontrado !');
      }
      return barber;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
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
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async findUniqueBarbershop(
    email: string,
    nomeDaBarbearia: string,
  ): Promise<Barbearia> {
    try {
      const barbearia = await this.prismaService.barbearia.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              nomeDaBarbearia,
            },
          ],
        },
      });

      return barbearia;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async createBarbershop(
    admin: SignUpAdminDto,
    hashedPassword: string,
    lat: string,
    lng: string,
  ): Promise<Barbearia> {
    try {
      const data = await this.prismaService.barbearia.create({
        data: {
          ...admin,
          senha: hashedPassword,
          latitude: lat,
          longitude: lng,
        },
      });

      return data;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async findBarbershop(email: string): Promise<Barbearia> {
    try {
      const barbearia = await this.prismaService.barbearia.findUnique({
        where: {
          email,
        },
      });

      if (!barbearia) {
        throw new NotFoundException('Barbearia não encontrada !');
      }
      return barbearia;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
    }
  }
}
