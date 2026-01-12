import { Injectable } from '@nestjs/common';
import { Movie } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MovieStatus } from './dto/movie.dto';

@Injectable()
export class MovieRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(
        page: number | undefined,
        limit: number | undefined,
        q: string | undefined,
        title: string | undefined,
        durationMinutes: number | undefined,
        language: string | undefined,
        order: string | undefined,
        rating: number | undefined,
        releaseDate: string | undefined,
        slug: string | undefined,
        sortBy: string | undefined,
        status: MovieStatus | undefined,
    ): Promise<Movie[]>
    {
        throw new Error('Method not implemented.');
    }
}
