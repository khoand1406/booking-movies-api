import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";

@Module({
    imports: [PrismaService],
    controllers: [BookingController],
    providers: [BookingRepository, BookingService ],
    exports: [BookingService]
    
})
export class BookingModule{
}