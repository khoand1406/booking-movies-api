import { Module } from "@nestjs/common";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [BookingController],
    providers: [BookingRepository, BookingService ],
    exports: [BookingService]
    
})
export class BookingModule{
}