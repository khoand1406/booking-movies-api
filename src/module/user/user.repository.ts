// Import the Client AND the User type from your generated file
import { User } from 'generated/prisma/client';
import prisma from 'src/lib/prisma';
import bcrypt from 'bcrypt';
import { CreateUserRPayload } from './dto/user.dto';

export class UserRepository {
  async validatePassword(user: User, password: string) {
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }
  // 1. Return 'User | null' instead of 'any' for type safety
  async findByEmail(email: string): Promise<User | null> {
    try {
      // 2. The error happens here if you don't pass the object inside ()
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
}
