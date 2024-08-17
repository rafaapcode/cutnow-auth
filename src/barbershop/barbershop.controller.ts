import { Body, Controller, Param, Put } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';
import { UpdateBarbershopDto } from './dto/updateBarbershop';
import { ZodValidationPipe } from './validation.pipe';
import { UpdateAdminSchema } from './validations/updateBodySchema';

@Controller('barbershop')
export class BarbershopController {
  constructor(private readonly barbershopService: BarbershopService) {}

  @Put(':id')
  // @UseGuards(AccessTokenGuard)
  async updateInfoBarbershop(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAdminSchema))
    updateBody: UpdateBarbershopDto,
  ) {
    const updateStatus = await this.barbershopService.updateBody(
      id,
      updateBody,
    );
    return {
      message: updateStatus.message,
    };
  }
}