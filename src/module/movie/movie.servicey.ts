import { Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { MovieQueryDto, MovieResponseDTO } from './dto/movie.dto';
import { relative } from 'path';
import { PaginatedResponse } from 'src/common/response.base';

@Injectable()
export class MovieService {
    constructor(private readonly movieRepository: MovieRepository) { }
    async getList(
        query: MovieQueryDto,
    ): Promise<PaginatedResponse<MovieResponseDTO>> {
        const {
            page=1,
            limit=10,
            q,
            title,
            durationMinutes,
            language,
            order,
            rating,
            releaseDate,
            slug,
            sortBy,
            status,
        } = query;
        const result = await this.movieRepository.findAll(
            page,
            limit,
            q,
            title,
            durationMinutes,
            language,
            order,
            rating,
            releaseDate,
            slug,
            sortBy,
            status,
        );
        const totalItems= await this.movieRepository.countAll(
            q,
            title,
            durationMinutes,
            language,
            order,
            rating,
            releaseDate,
            slug,
            sortBy,
            status,
        )

        const totalPages= Math.ceil(totalItems/limit)
        return new PaginatedResponse(result, page, totalPages, totalItems )
    }
}
