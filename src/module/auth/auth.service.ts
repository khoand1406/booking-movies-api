import { JwtService } from '@nestjs/jwt';
import prisma from 'src/lib/prisma';
import logger from 'src/utils/logger.utils';
import { UserRepository } from '../user/user.repository';
import { RegisterRequest, RegisterResponse } from './dto/register.dto';
import { processCreateRequest } from 'src/utils/user.utils';
import { UpdateProfileRequest, UpdateProfileResponse } from './dto/login.dto';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: JwtService;

  constructor(userRepository: UserRepository, jwtSecret: JwtService) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }
  async validateUser(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) return false;
      const isPasswordValid = await this.userRepository.validatePassword(
        user,
        password,
      );
      if (!isPasswordValid) return false;
      return true;
    } catch (error) {
      logger.error('Error validating user', error);
      throw error;
    }
  }

  generateJwtToken(userId: string, email: string): string {
    const payload = { sub: userId, email: email };
    const token = this.jwtSecret.sign(payload);
    return token;
  }

  async refreshToken(userId: number, token: string): Promise<string> {
    try {
      const refreshToken = this.jwtSecret.sign(
        { sub: userId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES || '3600', 10),
        },
      );
      await prisma.userToken.create({
        data: {
          refreshToken,
          userId: userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return refreshToken;
    } catch (error) {
      logger.error('Error refreshing token', error);
      throw error;
    }
  }

  async refresh(refreshAccessToken: string): Promise<any> {
    try {
      const tokenFind = await prisma.userToken.findFirst({
        where: {
          refreshToken: refreshAccessToken,
        },
      });
      if (!tokenFind) throw new Error('Invalid refresh token');
      const payload = this.jwtSecret.verify(refreshAccessToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtSecret.sign(
        { sub: payload.sub },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES || '900', 10),
        },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      logger.error('Error in refresh token method', error);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    await prisma.userToken.updateMany({
      where: { refreshToken },
      data: { revoked: true },
    });
  }
  async register(newUser: RegisterRequest): Promise<RegisterResponse> {
    try {
        const checkUser= await this.userRepository.findByEmail(newUser.email);
        if(checkUser){
            throw new Error('User already exists')
        }
        const res= processCreateRequest(newUser);
        const createdUser= await this.userRepository.createUser(res);
        return {
            id: createdUser.id,
            email: createdUser.email,
            name: createdUser.fullName
        }
    } catch (error) {
        throw error;
    }
  }
  async updateProfile(userId: number, updateData: UpdateProfileRequest): Promise<UpdateProfileResponse>{
    try {
      const findUser= await this.userRepository.findById(userId);
      if(!findUser){
        throw new Error('User not found');
      }
      const updatedUser= await this.userRepository.updateUser(userId, updateData);
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    } catch (error) {
      throw error;
    }
  }
}
