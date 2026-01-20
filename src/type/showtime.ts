import { Prisma } from "generated/prisma/client";
import { BookingType } from "src/common/constant/booking.enum";

export type ShowtimeWithMovieAndRoom = Prisma.ShowtimeGetPayload<{ include: { movie: true, room: true } }>

export interface GuestJWTPayload {
    bookingId: number;
    type: BookingType.GUEST
}