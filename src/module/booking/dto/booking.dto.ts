import { IsOptional, IsEmail, IsString, IsInt, Min } from "class-validator";

export interface BookingResponse {
  id: number;
  bookingCode: string;
  status: string;
  totalAmount: number;
  createdAt: Date;

  showtime: {
    id: number;
    startTime: Date;
    endTime: Date;
  };

  movie: {
    id: number;
    title: string;
    duration: number;
  };

  room: {
    id: number;
    name: string;
    code: string;
    cinemaId: number;
  };

  seatCount: number;
}

export class CreateBookingDto {
  seatIds!: number[]
  showtimeId!: number
  guestEmail?: string
  guestPhone?: string
}

export interface BookingDetailResponse {
  id: number;
  bookingCode: string;
  status: string;
  totalAmount: number;
  expiresAt: Date | null;
  createdAt: Date;

  showtime: {
    id: number;
    startTime: Date;
    endTime: Date;
  };

  movie: {
    id: number;
    title: string;
    duration: number;
  };

  room: {
    id: number;
    name: string;
    code: string;
    cinemaId: number;
  };

  seats: {
    id: number;
    rowLabel: string;
    seatNumber: number;
    seatType: string;
  }[];
}

export class UpdateBookingDto {
  seatIds!: number[]
  bookingId!: number
}

export class UpdateStatusBooking {
  bookingId!: number
  status!: string
}

export interface GuestBookingResponse {
  id: number;
  bookingCode: string;
  totalPrice: number;
  status: string;
  createdAt: Date;

  showtime: {
    id: number;
    startTime: Date;
    endTime: Date;

    movie: {
      id: number;
      title: string;
      durationMinutes: number;
    };

    cinema: {
      id: number;
      name: string;
      address: string;
    };

    room: {
      id: number;
      code: string;
      name: string;
    };
  };
}

export class GuestBookingQueryDto {
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 10;
}

export interface GuestRequestVerifyDto {
  bookingCode: string
  guestEmail: string
  guestPhone?: string
  otp: string
}

export interface GuestRequestConfirmDto{
  bookingCode: string,
  otp: string,
}

