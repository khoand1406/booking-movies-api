import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { PaginatedResponse } from 'src/common/response.base';
import bcrypt from 'bcrypt';
import {
    BookingDetailResponse,
    BookingResponse,
    CreateBookingDto,
    GuestBookingResponse,
    GuestRequestConfirmDto,
    GuestRequestVerifyDto,
    UpdateBookingDto,
    UpdateStatusBooking,
} from './dto/booking.dto';
import {
    BookingWithRelations,
    GuestBookingWithRelations,
} from 'src/type/booking';
import { InvalidOTPException } from 'src/common/errors/invalid-OTP.error';
import { JwtService } from '@nestjs/jwt';
import { BookingType } from 'src/common/constant/booking.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly JWTService: JwtService,
        private readonly mailService: MailService
    ) { }
    async getBookingList(
        page: number,
        pageSize: number,
        showtimeId: number,
        userId: number,
        status?: string,
    ): Promise<PaginatedResponse<BookingResponse>> {
        const result = await this.bookingRepository.getBookingList(
            page,
            pageSize,
            showtimeId,
            userId,
            status,
        );
        return {
            currentPage: page,
            data: result.data.map((item) => this.mapResponse(item)),
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    }

    async bookingDetail(bookingId: number): Promise<BookingDetailResponse> {
        const result = await this.bookingRepository.getBookingDetail(bookingId);
        return this.mapDetailResponse(result);
    }

    async createBooking(
        payload: CreateBookingDto,
        userId?: number,
    ): Promise<BookingDetailResponse> {
        if (!userId) {
            const result = await this.bookingRepository.createBooking(
                payload.seatIds,
                payload.showtimeId,
                undefined,
                payload.guestEmail,
                payload.guestPhone,
            );
            return this.mapDetailResponse(result);
        }
        const result = await this.bookingRepository.createBooking(
            payload.seatIds,
            payload.showtimeId,
            userId,
        );
        return this.mapDetailResponse(result);
    }

    async updateBooking(payload: UpdateBookingDto, bookingId: number) {
        await this.bookingRepository.updateBooking(payload.seatIds, bookingId);
    }

    async updateStatusBooking(bookingId: number, payload: UpdateStatusBooking) {
        await this.bookingRepository.updateBookingStatus(bookingId, payload.status);
    }

    async deleteBooking(bookingId: number, userId: number) {
        const result = await this.bookingRepository.deleteBooking(
            bookingId,
            userId,
        );
        return result;
    }

    async getGuestBooking(
        guestEmail?: string,
        guestPhone?: string,
        page?: number,
        pageSize: number = 10,
    ): Promise<PaginatedResponse<GuestBookingResponse>> {
        const result = await this.bookingRepository.guestBookingHistory(
            page,
            pageSize,
            guestEmail,
            guestPhone,
        );
        return {
            currentPage: result.page,
            data: result.data.map((item) => this.mapGuestBooking(item)),
            totalItems: result.total,
            totalPages: Math.ceil(result.total / pageSize),
        };
    }

    async verifyGuestRequest(dto: GuestRequestVerifyDto) {
        const booking = await this.bookingRepository.getBookingByCodeAndGuestEmail(dto.bookingCode, dto.guestEmail);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        await this.bookingRepository.createBookingOtpRecord(booking.id, otpHash);
        await this.mailService
    }

    async confirmGuestRequest(dto: GuestRequestConfirmDto) {
        const booking = await this.bookingRepository.getBookingByCode(
            dto.bookingCode,
        );
        const otpRecord = await this.bookingRepository.getOtpRecord(booking.id);
        if (otpRecord.expiresAt < new Date()) {
            throw new InvalidOTPException('OTP expired');
        }

        if (otpRecord.verifiedAt) {
            throw new InvalidOTPException('OTP already used');
        }
        const valid = await bcrypt.compare(dto.otp, otpRecord.otpHash);
        if (!valid) throw new InvalidOTPException('Invalid OTP');

        await this.bookingRepository.updateOtpVerification(otpRecord.id);
        const token = this.JWTService.sign(
            { bookingId: booking.id, type: BookingType.GUEST },
            { expiresIn: '10m' },
        );
        return { guestToken: token, expiresIn: 600 };
    }

    async getGuestBookingById(bookingId: number) {
        const booking = await this.bookingRepository.getBookingDetail(bookingId);

        if (!booking || booking.deletedAt) {
            throw new NotFoundException('Booking not found');
        }

        return this.mapDetailResponse(booking);
    }

    private mapResponse(booking: BookingWithRelations): BookingResponse {
        return {
            id: booking.id,
            bookingCode: booking.bookingCode,
            createdAt: booking.createdAt,
            status: booking.status,
            movie: {
                id: booking.showtime.movie.id,
                title: booking.showtime.movie.title,
                duration: booking.showtime.movie.durationMinutes,
            },
            room: {
                id: booking.showtime.room.id,
                cinemaId: booking.showtime.room.cinemaId,
                code: booking.showtime.room.code,
                name: booking.showtime.room.name,
            },
            showtime: {
                id: booking.showtime.id,
                startTime: booking.showtime.startTime,
                endTime: booking.showtime.endTime,
            },
            seatCount: booking.seats.length,
            totalAmount: Number(booking.totalAmount),
        };
    }

    private mapDetailResponse(
        booking: BookingWithRelations,
    ): BookingDetailResponse {
        return {
            id: booking.id,
            bookingCode: booking.bookingCode,
            status: booking.status,
            createdAt: booking.createdAt,
            expiresAt: booking.expiresAt,
            totalAmount: Number(booking.totalAmount),
            showtime: {
                id: booking.showtime.id,
                startTime: booking.showtime.startTime,
                endTime: booking.showtime.endTime,
            },

            movie: {
                id: booking.showtime.movie.id,
                title: booking.showtime.movie.title,
                duration: booking.showtime.movie.durationMinutes,
            },

            room: {
                id: booking.showtime.room.id,
                name: booking.showtime.room.name,
                code: booking.showtime.room.code,
                cinemaId: booking.showtime.room.cinemaId,
            },

            seats: booking.seats.map((bs) => ({
                id: bs.seat.id,
                rowLabel: bs.seat.rowLabel,
                seatNumber: bs.seat.seatNumber,
                seatType: bs.seat.seatType,
            })),
        };
    }
    private mapGuestBooking(
        booking: GuestBookingWithRelations,
    ): GuestBookingResponse {
        return {
            id: booking.id,
            bookingCode: booking.bookingCode,
            totalPrice: Number(booking.totalAmount),
            status: booking.status,
            createdAt: booking.createdAt,

            showtime: {
                id: booking.showtime.id,
                startTime: booking.showtime.startTime,
                endTime: booking.showtime.endTime,

                movie: {
                    id: booking.showtime.movie.id,
                    title: booking.showtime.movie.title,
                    durationMinutes: booking.showtime.movie.durationMinutes,
                },

                cinema: {
                    id: booking.showtime.room.cinema.id,
                    name: booking.showtime.room.cinema.name,
                    address: booking.showtime.room.cinema.address,
                },

                room: {
                    id: booking.showtime.room.id,
                    code: booking.showtime.room.code,
                    name: booking.showtime.room.name,
                },
            },
        };
    }
}
