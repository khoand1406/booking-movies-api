import { AuthGuard } from "@nestjs/passport";

export class GuestAuthGuard extends AuthGuard('guest-jwt') {
}