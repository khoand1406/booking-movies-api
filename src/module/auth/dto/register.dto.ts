export interface RegisterRequest{
    email: string;
    password: string;
    name: string;

    
}

export interface RegisterResponse{
    id: number;
    email: string;
    name: string;
    
}