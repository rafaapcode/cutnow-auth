import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HashPasswordModule } from './hash-password/hash-password.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { DatabaseModule } from './database/database.module';
import { BarbershopModule } from './barbershop/barbershop.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HashPasswordModule,
    GeolocationModule,
    DatabaseModule,
    BarbershopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
