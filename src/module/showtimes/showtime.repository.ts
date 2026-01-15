import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Showtime } from 'generated/prisma/client';
import { calculateOffset } from 'src/utils/paginated.utils';
import { CreateShowtimeDTO, ShowtimeStatus, UpdateShowtimeDTO } from './dto/showtime.dto';
import { BadRequestError } from 'src/common/errors/bad-request.error';
import { ShowtimeWithMovieAndRoom } from 'src/type/showtime/showtime';

@Injectable()
export class ShowtimeRepository {
    constructor(private readonly prisma: PrismaService) { }
    async getListShowtime(
        page: number = 1,
        pageSize: number = 10,
        q?: string,
        startTime?: Date,
        endTime?: Date,
        movieId?: number,
        cinemaId?: number,
        status?: string,
    ): Promise<{
        data: ShowtimeWithMovieAndRoom[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const take = pageSize ?? 10;
        const skip = page && page > 0 ? calculateOffset(take, page) : 0;
        const where = this.buildQueryShowtime(
            q,
            startTime,
            endTime,
            movieId,
            cinemaId,
            status,
        );
        const [result, count] = await this.prisma.$transaction([
            this.prisma.showtime.findMany({
                where,

                skip,
                take,
                orderBy: {
                    startTime: 'asc',
                },
                include: {
                    movie: true,
                    room: true,
                },
            }),
            this.prisma.showtime.count({ where }),
        ]);

        return {
            data: result,
            total: count,
            page,
            pageSize,
        };
    }

    private buildQueryShowtime(
        q?: string,
        startTime?: Date,
        endTime?: Date,
        movieId?: number,
        cinemaId?: number,
        status?: string,
    ): Prisma.ShowtimeWhereInput {
        const where: Prisma.ShowtimeWhereInput = {
            deletedAt: null
        };

        if (q) {
            where.OR = [
                {
                    movie: {
                        title: {
                            contains: q,
                        },
                    },
                },
                {
                    room: {
                        name: {
                            contains: q,
                        },
                    },
                },
            ];
        }

        if (movieId) {
            where.movieId = movieId;
        }

        if (cinemaId) {
            where.room = {
                cinemaId,
            };
        }

        if (status) {
            where.status = status;
        }

        if (startTime) {
            where.startTime = { gte: startTime };
        }

        if (endTime) {
            where.endTime = { lte: endTime };
        }

        return where;
    }

    async createShowtime(dto: CreateShowtimeDTO): Promise<ShowtimeWithMovieAndRoom> {
        const roomFindWithCode = await this.prisma.room.findUniqueOrThrow({
            where: {
                cinemaId_code: {
                    code: dto.roomCode,
                    cinemaId: dto.cinemaId,
                },
            },
        });
        const conflictTime = await this.checkOverlapShowtime(
            dto.cinemaId,
            dto.roomCode,
            dto.startTime,
            dto.endTime,
        );

        if (conflictTime) {
            throw new BadRequestError(
                'Overlap showtime with others in room with Id: ' + roomFindWithCode?.id,
            );
        }

        const result = await this.prisma.showtime.create({
            data: {
                movieId: dto.movieId,
                roomId: roomFindWithCode.id,
                startTime: dto.startTime,
                endTime: dto.endTime,
                basePrice: dto.basePrice,
                status: dto.status,
            },
            include: {
                movie: true,
                room: true
            }
        });
        return result;
    }

    async updateShowTime(id: number, dto: UpdateShowtimeDTO): Promise<ShowtimeWithMovieAndRoom> {
        const roomFindWithCode = await this.prisma.room.findUniqueOrThrow({
            where: {
                cinemaId_code: {
                    cinemaId: dto.cinemaId,
                    code: dto.roomCode,
                },
            },
        });
        const conflictShowTime = await this.checkOverlapShowtime(
            dto.cinemaId,
            dto.roomCode,
            dto.startTime,
            dto.endTime,
            id
        );
        if (conflictShowTime) {
            throw new BadRequestError(
                'Overlap showtime with others in room with Id: ' + roomFindWithCode?.id,
            );
        }
        const result = await this.prisma.showtime.update({
            where: { id },
            data: {
                movieId: dto.movieId,
                roomId: roomFindWithCode.id,
                startTime: dto.startTime,
                endTime: dto.endTime,
                basePrice: dto.basePrice,
                status: dto.status,
            },
            include: {
                movie: true,
                room: true,
            }
        });
        return result;
    }

    async checkOverlapShowtime(
        cinemaId: number,
        roomCode: string,
        startTime: Date,
        endTime: Date,
        excludeShowtimeId?: number,
    ): Promise<boolean> {
        const conflict = await this.prisma.showtime.findFirst({
            where: {
                deletedAt: null,
                ...(excludeShowtimeId && {
                    id: { not: excludeShowtimeId },
                }),
                room: {
                    cinemaId,
                    code: roomCode,
                },
                status: {
                    not: ShowtimeStatus.CANCELLED,
                },

                AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
            },
        });

        return !!conflict;
    }

    async deleteShowTime(id: number) {
        const showtime = await this.prisma.showtime.findUniqueOrThrow({ where: { id } })
        if (
            showtime.status === ShowtimeStatus.SHOWING ||
            showtime.startTime <= new Date()
        ) {
            throw new BadRequestError(
                "Can't delete showtime that has started",
            );
        }
        return this.prisma.showtime.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                status: ShowtimeStatus.CANCELLED,
            },
        });
    }
}
