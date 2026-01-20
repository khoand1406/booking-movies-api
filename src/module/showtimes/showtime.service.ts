import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/response.base';
import { ShowtimeWithMovieAndRoom } from 'src/type/showtime';
import {
    CreateShowtimeDTO,
    ShowtimeQuery,
    ShowtimeResponse,
    UpdateShowtimeDTO
} from './dto/showtime.dto';
import { ShowtimeRepository } from './showtime.repository';

@Injectable()
export class ShowtimeService {
    constructor(private readonly repository: ShowtimeRepository) { }
    async getShowtimes(
        query: ShowtimeQuery,
    ): Promise<PaginatedResponse<ShowtimeResponse>> {
        const { page, limit, q, startTime, endTime, status, cinemaId, movieId } =
            query;
        const result = await this.repository.getListShowtime(
            page,
            limit,
            q,
            startTime,
            endTime,
            movieId,
            cinemaId,
            status,
        );
        return new PaginatedResponse(
            result.data.map(this.mapResponse),
            result.page,
            Math.ceil(result.total / result.pageSize),
            result.total,
        );
    }

    async createShowtime(dto: CreateShowtimeDTO):Promise<ShowtimeResponse>{
        const result=  await this.repository.createShowtime(dto)
        return this.mapResponse(result);
    }

    async updateShowTime(id: number, dto: UpdateShowtimeDTO):Promise<ShowtimeResponse>{
        const result= await this.repository.updateShowTime(id, dto);
        return this.mapResponse(result);
    }

    async deleteShowtime(id: number): Promise<void>{
        await this.repository.deleteShowTime(id);
    }

    private mapResponse(showtime: ShowtimeWithMovieAndRoom): ShowtimeResponse {
        return {
            id: showtime.id,
            startTime: showtime.startTime,
            endTime: showtime.endTime,
            basePrice: Number(showtime.basePrice),
            status: showtime.status,

            movie: {
                id: showtime.movie.id,
                title: showtime.movie.title,
                duration: showtime.movie.durationMinutes,
            },

            room: {
                id: showtime.room.id,
                code: showtime.room.code,
                cinemaId: showtime.room.cinemaId,
                name: showtime.room.name,
            },
        };
    }
}
