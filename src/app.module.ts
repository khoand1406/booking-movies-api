import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { CinemaModule } from './module/cinema/cinema.module';

@Module({
  imports: [AuthModule, UserModule, CinemaModule]
})
export class AppModule {}
