import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterRequest } from '../auth/dto/register.dto';
import { DuplicateRecordError } from 'src/common/errors/duplicate-record.error';
import logger from 'src/utils/logger.utils';
import { processCreateRequest } from 'src/utils/user.utils';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserDetailResponse,
} from '../auth/dto/login.dto';

@Injectable()
export class UserService {
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async findUserById(userId: string) {
    return this.userRepository.findById(Number(userId));
  }
  async findUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  async findUserByPhone(phoneNumber: string) {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }
  async registerUser(payload: RegisterRequest) {
    const userFind = await this.findUserByEmail(payload.email);
    if (userFind) {
      logger.warn('Attempt to register duplicate email:', payload.email);
      throw new DuplicateRecordError(
        'User with email: ' + payload.email + ' already exists',
      );
    }
    const createPayload = processCreateRequest(payload);
    return this.userRepository.createUser(createPayload);
  }

  async updateProfile(
    userId: number,
    updateData: UpdateProfileRequest & { avatar?: string },
  ): Promise<UpdateProfileResponse> {
    const updatedUser = await this.userRepository.updateUser(userId, {
      name: updateData.name,
      phone: updateData.phone,
      address: updateData.address,
      avatarUrl: updateData.avatar,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone ?? '',
      address: updatedUser.address ?? '',
    };
  }

  async getUserProfile(userId: number): Promise<UserDetailResponse> {
    const user = await this.userRepository.findById(userId);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      avatarUrl: user.avatarUrl || '',
      createdAt: user.createdAt,
      username: user.username,
      address: user.address || '',
    };
  }
}
