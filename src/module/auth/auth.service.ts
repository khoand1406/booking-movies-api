import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadCredentialsError } from 'src/common/errors/bad-credientals.error';
import { DuplicateRecordError } from 'src/common/errors/duplicate-record.error';
import { BaseError } from 'src/common/errors/error.base';
import { InvalidTokenError } from 'src/common/errors/invalid-token.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { ERROR_RESPONSE_MESSAGE } from 'src/constant/response-message.constant';
import { processCreateRequest } from 'src/utils/user.utils';
import { UserRepository } from '../user/user.repository';
import { ForgetPasswordRequest } from './dto/auth.dto';
import {
  UserResponseBasicInfo,
} from './dto/login.dto';
import { RegisterRequest, RegisterResponse } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {

  private readonly userRepository: UserRepository;
  private readonly jwtService: JwtService;
  private readonly prisma: PrismaService;

  constructor(userRepository: UserRepository, jwtService: JwtService, prisma: PrismaService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.prisma = prisma;
  }
  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return false;
    const isPasswordValid = await this.userRepository.validatePassword(
      user,
      password,
    );
    if (!isPasswordValid) return false;
    return true;
  }

  generateJwtToken(userId: string, email: string): string {
    const payload = { sub: userId, email: email };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES || '604800', 10),
      },
    );

    await this.prisma.userToken.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return refreshToken;
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    const tokenRecord = await this.prisma.userToken.findFirst({
      where: { refreshToken: token },
    });

    if (!tokenRecord || tokenRecord.revoked) {
      throw new InvalidTokenError(ERROR_RESPONSE_MESSAGE.INVALID_TOKEN);
    }

    let payload;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new InvalidTokenError(ERROR_RESPONSE_MESSAGE.INVALID_TOKEN);
    }

    return {
      accessToken: this.generateJwtToken(payload.sub, payload.email),
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.userToken.updateMany({
      where: { refreshToken },
      data: { revoked: true },
    });
  }
  async register(newUser: RegisterRequest): Promise<RegisterResponse> {
    const checkUser = await this.userRepository.findByEmail(newUser.email);
    if (checkUser) {
      throw new DuplicateRecordError(ERROR_RESPONSE_MESSAGE.EMAIL_ALREADY_EXISTS);
    }
    const res = processCreateRequest(newUser);
    const createdUser = await this.userRepository.createUser(res);
    return {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.username,
    };
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserResponseBasicInfo;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(ERROR_RESPONSE_MESSAGE.USER_NOT_FOUND);
    }
    const isPasswordValid = await this.userRepository.validatePassword(
      user,
      password,
    );
    if (!isPasswordValid) {
      throw new BadCredentialsError(ERROR_RESPONSE_MESSAGE.INVALID_CREDENTIALS);
    }
    const accessToken = this.generateJwtToken(user.id.toString(), user.email);
    const refreshToken = await this.generateRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl || '',
      },
    };
  }

  
  async forgetPassword(req: ForgetPasswordRequest) {
    throw new BaseError('NOT_IMPLEMENTED', 'Forget password not implemented');
  }
}
