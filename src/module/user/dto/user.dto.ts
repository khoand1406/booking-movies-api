export interface CreateUserRPayload {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    createdAt: Date;
}