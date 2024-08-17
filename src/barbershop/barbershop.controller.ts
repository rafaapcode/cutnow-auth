import { Controller } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';

@Controller('barbershop')
export class BarbershopController {
  constructor(private readonly barbershopService: BarbershopService) {}
}
