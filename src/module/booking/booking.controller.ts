import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { currentGuest } from 'src/common/decorators/current-guest.decorator';
import { currentUser } from 'src/common/decorators/current-user.decorator';
import { JWTAuthGuard } from 'src/common/guard/auth.guard';
import { GuestAuthGuard } from 'src/common/guard/guest-auth.guard';
import { OptionalJWTAuthGuard } from 'src/common/guard/optional-auth.guard';
import { BookingService } from './booking.service';
import {
    CreateBookingDto,
    GuestRequestConfirmDto,
    GuestRequestVerifyDto,
    UpdateBookingDto,
    UpdateStatusBooking
} from './dto/booking.dto';

@Controller('bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @UseGuards(JWTAuthGuard)
    @Get()
    async getBookingList(
        @currentUser() user: { id: number; email: string; role: string },
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('showtimeId', ParseIntPipe) showtimeId: number,
        @Query('status') status?: string,
    ) {
        const userId = user.id;
        return await this.bookingService.getBookingList(
            page,
            limit,
            showtimeId,
            userId,
            status,
        );
    }

    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number) {
        return await this.bookingService.bookingDetail(id);
    }

    @UseGuards(OptionalJWTAuthGuard)
    @Post()
    async createBooking(@Req() req: any, @Body() body: CreateBookingDto) {
        const userId = req.user ? req.user.id : null;

        return this.bookingService.createBooking(
            {
                ...body,
            },
            userId,
        );
    }

    @UseGuards(JWTAuthGuard)
    @Patch(':id')
    async updateBooking(
        @Body() body: UpdateBookingDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const payload = { ...body };
        return this.bookingService.updateBooking(payload, id);
    }

    @UseGuards(JWTAuthGuard)
    @Put(':id')
    async updateBookingStatus(
        @Body() body: UpdateStatusBooking,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const payload = { ...body };
        return this.bookingService.updateStatusBooking(id, payload);
    }

    @UseGuards(JWTAuthGuard)
    @Delete(':id')
    async deleteBooking(
        @currentUser() user: { id: number; email: string; role: string },
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.bookingService.deleteBooking(id, user.id);
    }

    @Post('guest/verify')
    async verifyGuest(@Body() dto: GuestRequestVerifyDto) {
        return this.bookingService.verifyGuestRequest(dto);
    }

    @Post('guest/confirm')
    async confirmGuest(@Body() dto: GuestRequestConfirmDto) {
        return this.bookingService.confirmGuestRequest(dto);
    }

    @UseGuards(GuestAuthGuard)
    @Get('guest/history')
    async getGuestBooking(@currentGuest() guest: { bookingId: number }) {
        return this.bookingService.getGuestBookingById(guest.bookingId);
    }
}
