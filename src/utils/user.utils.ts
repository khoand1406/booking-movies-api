import { RegisterRequest } from "src/module/auth/dto/register.dto";
import { CreateUserRPayload } from "src/module/user/dto/user.dto";

export function processBatch(){
    // Implementation for processing batch operations
}

export function processCreateRequest(request: RegisterRequest): CreateUserRPayload{
    const result= {
        email: request.email,
        password: request.password,
        username: request.name,
        phoneNumber: '',
        role: 'user',
        createdAt: new Date()
    }
    return result;
}
