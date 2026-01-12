import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { JWTStrategy } from 'src/common/stragegy/jwt.stagegy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JWTStrategy],
  exports: [AuthService],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chapmoitheloaibug',
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AuthModule {}
