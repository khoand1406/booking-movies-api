import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ShowTimeController } from "./showtime.controller";
import { ShowtimeRepository } from "./showtime.repository";
import { ShowtimeService } from "./showtime.service";

@Module({
    imports:[PrismaService],
    controllers: [ShowTimeController],
    providers: [ShowtimeRepository, ShowtimeService],
    exports: [ShowtimeService]
})
export class ShowtimeModule{}