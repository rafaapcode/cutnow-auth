import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BarbershopController } from './barbershop.controller';
import { BarbershopService } from './barbershop.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BarbershopController],
  providers: [BarbershopService],
})
export class BarbershopModule {}
