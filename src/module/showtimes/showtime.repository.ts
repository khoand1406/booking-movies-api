import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Showtime } from 'generated/prisma/client';
import { calculateOffset } from 'src/utils/paginated.utils';
import { CreateShowtimeDTO } from './dto/showtime.dto';

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
        data: Showtime[];
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
        const where: Prisma.ShowtimeWhereInput = {};

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

        if (startTime || endTime) {
            where.startTime = {
                ...(startTime && { gte: startTime }),
                ...(endTime && { lte: endTime }),
            };
        }

        return where;
    }

    async createShowtime(dto: CreateShowtimeDTO): Promise<Showtime> { }

    async checkOverlapShowtime(
        roomId: number,
        startTime: Date,
        endTime: Date,
        excludeShowtimeId?: number,
    ): Promise<boolean> {
        const conflict = await this.prisma.showtime.findFirst({
            where: {
                roomId,
                ...(excludeShowtimeId && {
                    id: { not: excludeShowtimeId },
                }),
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gt: startTime } },
                ],
            },
        });

        return !!conflict;
    }
}
