import { Prisma } from "generated/prisma/client";

export type BookingWithRelations = Prisma.BookingGetPayload<{
    include: {
        showtime: {
            include: {
                movie: true,
                room: true
            }
        },
        seats: {
            include: {
                seat: true
            }
        }

    }
}>

export type GuestBookingWithRelations =
    Prisma.BookingGetPayload<{
        include: {
            showtime: {
                include: {
                    movie: true;
                    room: {
                        include: {
                            cinema: true;
                        };
                    };
                };
            };
        };
    }>;