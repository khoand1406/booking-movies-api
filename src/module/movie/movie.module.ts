import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { MovieController } from "./movie.controller";
import { MovieRepository } from "./movie.repository";
import { MovieService } from "./movie.servicey";

@Module({
    imports: [PrismaModule],
    controllers: [MovieController],
    providers: [MovieService, MovieRepository],
    exports: [MovieService],
})
export class MovieModule{}