import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GuestJWTPayload } from "src/type/showtime";
import { BookingType } from "../constant/booking.enum";

@Injectable()
export class GuestJWTStrategy extends PassportStrategy(Strategy, 'guest-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_GUEST_SECRET || process.env.JWT_ACCESS_SECRET || '',
            ignoreExpiration: false,
        });
    }
    validate(payload: GuestJWTPayload) {
        if(!payload || payload.type!==BookingType.GUEST || !payload.bookingId){
            throw new UnauthorizedException("Invalid guest token");
        }
        return{
            bookingId: payload.bookingId,
            type: payload.type
        }
    }

}