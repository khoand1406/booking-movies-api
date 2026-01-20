import { Module } from "@nestjs/common";
import { ShowTimeController } from "./showtime.controller";
import { ShowtimeRepository } from "./showtime.repository";
import { ShowtimeService } from "./showtime.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers: [ShowTimeController],
    providers: [ShowtimeRepository, ShowtimeService],
    exports: [ShowtimeService]
})
export class ShowtimeModule{}