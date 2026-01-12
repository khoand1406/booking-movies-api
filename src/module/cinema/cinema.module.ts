import { Module } from "@nestjs/common";
import { CinemaController } from "./cinema.controller";
import { CinemaService } from "./cinema.service";
import { CinemaRepository } from "./cinema.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [CinemaController],
    providers: [CinemaService, CinemaRepository],
    exports: [CinemaService],
})
export class CinemaModule{}