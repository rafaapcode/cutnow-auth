import { Body, Controller, Param, Put, UsePipes } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';
import { UpdateBarbershopDto } from './dto/updateBarbershop';
import { ZodValidationPipe } from './validation.pipe';
import { UpdateAdminSchema } from './validations/updateBodySchema';

@Controller('barbershop')
export class BarbershopController {
  constructor(private readonly barbershopService: BarbershopService) {}

  @Put(':id')
  // @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(UpdateAdminSchema))
  async updateInfoBarbershop(
    @Param('id') id: string,
    @Body() updateBody: UpdateBarbershopDto,
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
