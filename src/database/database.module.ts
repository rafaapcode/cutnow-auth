import { Module } from '@nestjs/common';
import { GeolocationModule } from 'src/geolocation/geolocation.module';
import { PrismaService } from 'src/prisma.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [GeolocationModule],
  providers: [DatabaseService, PrismaService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
