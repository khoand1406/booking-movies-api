import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BookingType } from "../constant/booking.enum";

export const currentGuest= createParamDecorator((_: unknown, ctx: ExecutionContext)=> {
    const request= ctx.switchToHttp().getRequest();
    return request.user as {bookingId: number, type: BookingType.GUEST}
})