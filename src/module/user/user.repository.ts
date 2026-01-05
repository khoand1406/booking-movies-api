// Import the Client AND the User type from your generated file
import { User } from 'generated/prisma/client';
import prisma from 'src/lib/prisma';
import bcrypt from 'bcrypt';
import { CreateUserRPayload } from './dto/user.dto';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserDetailResponse,
} from '../auth/dto/login.dto';
import logger from 'src/utils/logger.utils';

export class UserRepository {
  async updateUser(
    userId: number,
    updateData: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    try {
       const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: updateData.name,
        phone: updateData.phone,
      },
    });
    logger.log('User updated successfully:', updatedUser);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.fullName,
      phone: updatedUser.phone || '',
    };
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
   
  }

  async findById(userId: number): Promise<UserDetailResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || undefined,
        createdAt: user.createdAt || undefined,
        role: user.role,
      };
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }
  async validatePassword(user: User, password: string) {
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return result;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  async createUser(payload: CreateUserRPayload): Promise<User> {
    const userFind = await this.findByEmail(payload.email);
    if (userFind) {
      throw new Error('User already exists');
    }
    const userFindByPhone = this.findByPhoneNumber(payload.phoneNumber);
    if (userFindByPhone != null) {
      throw new Error('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        fullName: payload.fullName,
        phone: payload.phoneNumber,
        role: 'user',
        createdAt: new Date(),
      },
    });
    return newUser;
  }
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      const result = await prisma.user.findFirst({
        where: {
          phone: phoneNumber,
        },
      });
      return result;
    } catch (error) {
      console.error('Error finding user by phone number:', error);
      throw error;
    }
  }

  async insertBatchUsers(users: CreateUserRPayload[]): Promise<any>{
    try {
      
    } catch (error) {
      
    }
  }
}
