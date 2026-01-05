export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserLoginResponse{
    
}

export interface UpdateProfileRequest{
    name?: string;
    phone?: string;
    
}

export interface UpdateProfileResponse{
    id: number;
    email: string;
    name: string;
    phone?: string;
    address?: string;
}

export interface UserDetailResponse{
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
    createdAt?: Date;
}