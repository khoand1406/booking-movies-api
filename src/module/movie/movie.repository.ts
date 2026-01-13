import { Injectable } from '@nestjs/common';
import { Movie, Prisma } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDTO, MovieStatus, UpdateMovieDTO } from './dto/movie.dto';
import { calculateOffset } from 'src/utils/paginated.utils';

@Injectable()
export class MovieRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(
        page?: number,
        limit?: number,
        q?: string,
        title?: string,
        durationMinutes?: number,
        language?: string,
        order?: 'asc' | 'desc',
        rating?: number,
        releaseDate?: string,
        slug?: string,
        sortBy?: keyof Movie,
        status?: MovieStatus,
    ): Promise<Movie[]> {
        const where = this.buildCondition(
            q,
            title,
            durationMinutes,
            language,
            rating,
            releaseDate,
            slug,
            status,
        );

        const take = limit ?? 10;
        const skip = page && page > 0 ? calculateOffset(page, take) : 0;

        const orderBy: Prisma.MovieOrderByWithRelationInput | undefined = sortBy
            ? {
                [sortBy]: order ?? 'desc',
            }
            : undefined;

        return this.prisma.movie.findMany({
            where,
            skip,
            take,
            orderBy,
        });
    }

    async findOne(id: number): Promise<Movie | null> {
        return await this.prisma.movie.findUnique({ where: { id: id }, });
    }

    async create(payload: CreateMovieDTO): Promise<Movie> {
        const newMovie = await this.prisma.movie.create({ data: payload });
        return newMovie;
    }

    async update(id: number, payload: UpdateMovieDTO): Promise<Movie> {
        const updated = await this.prisma.movie.update({
            where: { id },
            data: payload,
        });
        return updated;
    }
    async countAll(
        q?: string,
        title?: string,
        durationMinutes?: number,
        language?: string,
        order?:string,
        rating?: number,
        releaseDate?: string,
        slug?: string,
        sortBy?:string,
        status?: MovieStatus,
        

    ) {
        const where = this.buildCondition(
            q,
            title,
            durationMinutes,
            language,
            rating,
            releaseDate,
            slug,
            status,
        );
        return await this.prisma.movie.count({ where: where });
    }

    private buildCondition(
        q?: string,
        title?: string,
        durationMinutes?: number,
        language?: string,
        rating?: number,
        releaseDate?: string,
        slug?: string,
        status?: MovieStatus,
    ): Prisma.MovieWhereInput {
        const where: Prisma.MovieWhereInput = {};

        // Search
        if (q) {
            where.OR = [{ title: { contains: q } }, { slug: { contains: q } }];
        }

        if (title) {
            where.title = {
                contains: title,
            };
        }

        if (slug) {
            where.slug = {
                equals: slug,
            };
        }

        if (language) {
            where.language = {
                equals: language,
            };
        }

        if (rating !== undefined) {
            where.rating = rating;
        }

        if (durationMinutes !== undefined) {
            where.durationMinutes = durationMinutes;
        }

        if (status) {
            where.status = status;
        }

        if (releaseDate) {
            where.releaseDate = {
                gte: new Date(releaseDate),
            };
        }

        return where;
    }
}
