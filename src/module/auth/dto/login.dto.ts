import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UserLoginRequest {
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character.',
        },
    )
    password!: string;
}

export interface UserLoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDetailResponse;
}

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
}

export interface UpdateProfileResponse {
    id: number;
    email: string;
    name: string;
    phone?: string;
    address?: string;
}
export interface UserResponseBasicInfo {
    id: number;
    email: string;
    username: string;
    avatarUrl?: string;
}

export interface UserDetailResponse {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    avatarUrl?: string;
    createdAt?: Date;
    username: string;
    address?: string;
}
