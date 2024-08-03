import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HashPasswordModule } from './hash-password/hash-password.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HashPasswordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
