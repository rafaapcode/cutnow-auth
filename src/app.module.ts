import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), UsersModule],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
