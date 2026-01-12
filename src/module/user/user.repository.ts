import bcrypt from 'bcrypt';
import { CreateUserRPayload } from './dto/user.dto';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../auth/dto/login.dto';
import { User } from 'generated/prisma/client';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { DuplicateRecordError } from 'src/common/errors/duplicate-record.error';
import { ERROR_RESPONSE_MESSAGE } from 'src/constant/response-message.constant';
import { PrismaService } from '../prisma/prisma.service';

export class UserRepository {
  constructor(private readonly prisma: PrismaService){}
  async updateUser(
    userId: number,
    updateData: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: updateData.name,
        phone: updateData.phone,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.fullName,
      phone: updatedUser.phone || '',
    };
  }

  async findById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(ERROR_RESPONSE_MESSAGE.USER_NOT_FOUND);
    }

    return user;
  }

  async validatePassword(user: User, password: string) {
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return result;
  }
  async createUser(payload: CreateUserRPayload): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          username: payload.username,
          fullName: '',
          phone: payload.phoneNumber,
          role: 'user',
          createdAt: new Date(),
        },
      });
      return newUser;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new DuplicateRecordError(
          `Duplicate field: ${error.meta?.target?.join(', ')}`,
        );
      }
      throw error;
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const result = await this.prisma.user.findFirst({
      where: {
        phone: phoneNumber,
      },
    });
    return result;
  }

  async insertBatchUsers(users: CreateUserRPayload[]): Promise<any> {
    try {
    } catch (error) { }
  }
}
