import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { PaginatedResponse } from 'src/common/response.base';
import { CreateMovieDTO, MovieDetailResponseDTO, MovieQueryDto, MovieResponseDTO, UpdateMovieDTO } from './dto/movie.dto';
import { MovieRepository } from './movie.repository';

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
           q, title, durationMinutes, language, order, rating, releaseDate, slug, sortBy, status
        )

        const totalPages= Math.ceil(totalItems/limit)
        return new PaginatedResponse(result, page, totalPages, totalItems )
    }
    async getMovie(id:number):Promise<MovieDetailResponseDTO>{
        const result= await this.movieRepository.findOne(id);
        if(!result) throw new NotFoundError("Not found movie");
        return {
            id: result.id,
            title: result.title,
            description: result.description,
            durationMinutes: result.durationMinutes,
            endDate: result.endDate,
            language: result.language,
            posterUrl: result.posterUrl,
            slug: result.slug,
            trailerUrl: result.trailerUrl,
            releaseDate: result.releaseDate,
            status: result.status,
            updatedAt: result.updatedAt
        };
    }
    async createMovie(payload: CreateMovieDTO): Promise<MovieResponseDTO>{
        const newMovie= await this.movieRepository.create(payload);
        return {
            id: newMovie.id,
            title: newMovie.title,
            description: newMovie.description,
            durationMinutes: newMovie.durationMinutes,
            endDate: newMovie.endDate,
            language: newMovie.language,
            posterUrl: newMovie.posterUrl,
            releaseDate: newMovie.releaseDate,
            slug: newMovie.slug,
            status: newMovie.status

        }
    }

    async updateMovie(id: number, payload: UpdateMovieDTO): Promise<MovieResponseDTO>{
        const updatedMovie= await this.movieRepository.update(id, payload);
        return updatedMovie;
    }

    async deleteMovie(id: number): Promise<void>{
        await this.deleteMovie(id);
    }

}
