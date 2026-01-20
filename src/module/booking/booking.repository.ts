import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { BookingStatus } from 'src/common/constant/booking.enum';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { PaginatedResponse } from 'src/common/response.base';
import { BookingWithRelations } from 'src/type/booking';
import { calculateOffset } from 'src/utils/paginated.utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingRepository {
    constructor(private readonly prisma: PrismaService) { }
    async getBookingList(
        page = 1,
        pageSize = 10,
        showtimeId?: number,
        userId?: number,
        status?: string,
    ): Promise<PaginatedResponse<BookingWithRelations>> {
        const where: Prisma.BookingWhereInput = {
            deletedAt: null,
            ...(showtimeId && { showtimeId }),
            ...(userId && { userId }),
            ...(status && { status }),
        };

        const skip = calculateOffset(page, pageSize);
        const [data, total] = await this.prisma.$transaction([
            this.prisma.booking.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    showtime: {
                        include: {
                            movie: true,
                            room: true,
                        },
                    },
                    seats: {
                        include: {
                            seat: true,
                        },
                    },
                },
            }),
            this.prisma.booking.count({ where }),
        ]);
        return {
            currentPage: page,
            data: data,
            totalItems: total,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async checkSeatOverlap(
        tx: Prisma.TransactionClient,
        showtimeId: number,
        seatIds: number[],
    ) {
        return tx.bookingSeat.findFirst({
            where: {
                seatId: { in: seatIds },
                booking: {
                    showtimeId,
                    deletedAt: null,
                    status: { not: 'CANCELLED' },
                },
            },
        });
    }

    async getBookingDetail(bookingId: number): Promise<BookingWithRelations> {
        const detail = await this.prisma.booking.findUniqueOrThrow({
            where: { id: bookingId },
            include: {
                showtime: { include: { movie: true, room: true } },
                seats: { include: { seat: true } },
            },
        });
        return detail;
    }

    async createBooking(
        seatIds: number[],
        showtimeId: number,
        userId?: number,
        guestEmail?: string,
        guestPhone?: string,
    ): Promise<BookingWithRelations> {
        return this.prisma.$transaction(async (tx) => {
            const conflict = await this.checkSeatOverlap(tx, showtimeId, seatIds);
            if (conflict) throw new BadRequestError('Seat has been booked before');
            const showtime = await tx.showtime.findUniqueOrThrow({
                where: { id: showtimeId },
            });
            const totalPrice = Number(showtime.basePrice) * seatIds.length;
            const seats = await tx.seat.findMany({
                where: {
                    id: { in: seatIds },
                    roomId: showtime.roomId,
                    isActive: true,
                },
            });
            if (seats.length !== seatIds.length) {
                throw new BadRequestError('invalid seat selection');
            }
            return tx.booking.create({
                data: {
                    showtimeId: showtimeId,
                    userId,
                    status: 'PENDING',
                    totalAmount: totalPrice,
                    bookingCode: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    createdAt: new Date(Date.now()),
                    guestEmail,
                    guestPhone,
                    seats: {
                        create: seatIds.map((item) => ({
                            seatId: item,
                            seatPrice: showtime.basePrice,
                        })),
                    },
                },
                include: {
                    seats: {
                        include: {
                            seat: true,
                        },
                    },
                    showtime: {
                        include: {
                            movie: true,
                            room: true,
                        },
                    },
                },
            });
        });
    }

    async updateBooking(seatIds: number[], bookingId: number) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUniqueOrThrow({
                where: { id: bookingId },
                include: { showtime: true },
            });
            const seats = await tx.seat.findMany({
                where: {
                    id: { in: seatIds },
                    roomId: booking.showtime.roomId,
                    isActive: true,
                },
            });
            if (seats.length !== seatIds.length)
                throw new BadRequestError('Invalid seat selection');
            const conflict = await tx.bookingSeat.findFirst({
                where: {
                    seatId: { in: seatIds },
                    bookingId: { not: bookingId },
                    booking: {
                        showtimeId: booking.showtimeId,
                        deletedAt: null,
                        status: { not: BookingStatus.CANCELLED },
                    },
                },
            });
            if (conflict) throw new BadRequestError('Seat has been booked ');
            await tx.bookingSeat.deleteMany({ where: { bookingId } });
            await tx.bookingSeat.createMany({
                data: seatIds.map((item) => ({
                    bookingId,
                    seatId: item,
                    seatPrice: booking.showtime.basePrice,
                })),
            });
            await tx.booking.update({
                where: { id: bookingId },
                data: {
                    totalAmount: Number(booking.showtime.basePrice) * seatIds.length,
                },
                include: {
                    seats: { include: { seat: true } },
                    showtime: { include: { movie: true, room: true } },
                },
            });
        });
    }

    async updateBookingStatus(bookingId: number, status: string) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUniqueOrThrow({
                where: { id: bookingId },
                include: { showtime: true },
            });
            if (booking.status !== BookingStatus.PENDING)
                throw new BadRequestError('Only PENDING booking can be updated');
            if (booking.expiresAt && booking.expiresAt < new Date())
                throw new BadRequestError('Expired booking');
            return tx.booking.update({
                where: { id: bookingId },
                data: { status: status },
            });
        });
    }

    async deleteBooking(bookingId: number, userId: number) {
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUniqueOrThrow({
                where: { id: bookingId, userId: userId },
                include: { showtime: true },
            });
            if (booking.status === BookingStatus.PAID)
                throw new BadRequestError("Can't delete PAID booking");
            return tx.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.CANCELLED, deletedAt: new Date() },
            });
        });
    }

    async guestBookingHistory(
        page = 1,
        limit = 10,
        guestEmail?: string,
        guestPhone?: string,
    ) {
        const skip = (page - 1) * limit;

        const where = {
            deletedAt: null,
            ...(guestEmail && { guestEmail }),
            ...(guestPhone && { guestPhone }),
        };

        const [data, total] = await this.prisma.$transaction([
            this.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    showtime: {
                        include: {
                            movie: true,
                            room: {
                                include: {
                                    cinema: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.booking.count({ where }),
        ]);

        return { data, total, page, limit };
    }
}
