import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() request: UserLoginRequest) {
        return this.authService.authenticate(
            request.email,
            request.password,
        );
    }

    @Post('register')
    register(@Body() request: RegisterRequest) {
        return this.authService.register(request);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') token: string) {
        return this.authService.refresh(token);
    }

    @Post('logout')
    logout(@Body('refreshToken') token: string) {
        return this.authService.logout(token);
    }

}
