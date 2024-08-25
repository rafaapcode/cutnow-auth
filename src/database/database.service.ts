import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Barbearia, Barbeiro } from '@prisma/client';
import { SignUpAdminDto, SignUpBarberDto } from 'src/auth/dto/auth.dto';
import { UpdateBarbershopDto } from '../barbershop/dto/updateBarbershop';
import { GeolocationService } from '../geolocation/geolocation.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly geolocationService: GeolocationService,
  ) {}

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

  async findBarber(email: string): Promise<any> {
    try {
      const barber = await this.prismaService.barbeiro.findUnique({
        where: {
          email,
        },
      });

      if (!barber) {
        throw new NotFoundException('Barbeiro não encontrado !');
      }
      return {
        ...barber,
        id: barber.id,
        email: barber.email,
        barbearia_id: barber.barbearia_id,
        status: barber.status,
        cpf: barber.cpf,
        senha: barber.senha,
      };
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
    cnpj: string,
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
            {
              cnpj,
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

  async findBarbershop(email: string): Promise<any> {
    try {
      const barbearia = await this.prismaService.barbearia.findUnique({
        where: {
          email,
        },
      });

      if (!barbearia) {
        throw new NotFoundException('Barbearia não encontrada !');
      }
      return {
        ...barbearia,
        id: barbearia.id,
        email: barbearia.email,
        nomeDaBarbearia: barbearia.nomeDaBarbearia,
        lat: barbearia.latitude,
        lng: barbearia.longitude,
        senha: barbearia.senha,
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async verfifyBarbershop(
    email: string,
    nomeDaBarbearia: string,
    cnpj: string,
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const [seachByEmail, seachByNome, seachByCnpj] = await Promise.all([
        this.prismaService.barbearia.findUnique({ where: { email } }),
        this.prismaService.barbearia.findUnique({ where: { nomeDaBarbearia } }),
        this.prismaService.barbearia.findUnique({ where: { cnpj } }),
      ]);

      if (seachByCnpj) {
        return { status: true, message: 'cnpj' };
      }

      if (seachByNome) {
        return { status: true, message: 'nomeBarbearia' };
      }

      if (seachByEmail) {
        return { status: true, message: 'Email' };
      }

      return { status: false };
    } catch (error) {
      console.log(error.message);
      return { status: false, message: error.message };
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async updateBarbershop(
    id: string,
    updateBody: UpdateBarbershopDto,
  ): Promise<{ status: boolean; message?: string }> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const barbearia = await tx.barbearia.findUnique({
          where: {
            id,
          },
          select: {
            cnpj: true,
            email: true,
            informacoes: {
              select: {
                bairro: true,
                cep: true,
                cidade: true,
                estado: true,
                horarioAbertura: true,
                horarioFechamento: true,
                numero: true,
                rua: true,
              },
            },
            latitude: true,
            longitude: true,
            nome: true,
            nomeDaBarbearia: true,
          },
        });
        if (!barbearia) {
          return { status: false };
        }

        const { informacoes: informations, ...otherInfos } = updateBody;
        const { informacoes, ...infosAboutBarbershop } = barbearia;
        let latLng = {};
        if (informations && informations.cep) {
          const dataResponse = await this.geolocationService.getLatAndLong({
            bairro: informations.bairro,
            cep: informations.cep,
            cidade: informations.cidade,
            estado: informations.estado,
            numero: informations.numero,
            rua: informations.rua,
          });

          const { lat, lng } = dataResponse.geometry.location;

          latLng = {
            latitude: `${lat}`,
            longitude: `${lng}`,
          };
        }

        const newData = {
          ...infosAboutBarbershop,
          ...otherInfos,
          ...latLng,
        };

        const newInformations = {
          ...informacoes,
          ...informations,
        };
        await Promise.all([
          tx.barbearia.update({
            where: {
              id,
            },
            data: {
              ...newData,
            },
          }),
          tx.barbearia.update({
            where: {
              id,
            },
            data: {
              informacoes: {
                update: {
                  ...newInformations,
                },
              },
            },
          }),
        ]);
      });

      return { status: true, message: 'Dados atualizados com sucesso !' };
    } catch (error) {
      console.log('Database Error: ', error.message);
      return { status: false, message: error.message };
    } finally {
      await this.prismaService.$disconnect();
    }
  }
}
