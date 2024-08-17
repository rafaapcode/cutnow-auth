import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateBarbershopDto } from './dto/updateBarbershop';

@Injectable()
export class BarbershopService {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateBody(id: string, updateBody: UpdateBarbershopDto) {
    try {
      const barbershopUpdated = await this.databaseService.updateBarbershop(
        id,
        updateBody,
      );

      if (!barbershopUpdated.status) {
        throw new BadRequestException(barbershopUpdated.message);
      }

      return {
        message: barbershopUpdated.message,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
