import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { PaginatedResponse } from 'src/common/response.base';
import { calculateOffset } from 'src/utils/paginated.utils';
import { CinemaRepository } from './cinema.repository';
import {
    CinemaDetailResponse,
    CinemaQueryDto,
    CinemaResponseDto,
    CreateCinemaDto,
    UpdateCinemaDto,
} from './dto/cinema.dto';

@Injectable()
export class CinemaService {
    constructor(private readonly cinemaRepository: CinemaRepository) { }
    async findAll(
        query: CinemaQueryDto,
    ): Promise<PaginatedResponse<CinemaResponseDto>> {
        const {
            page = 1,
            limit = 10,
            q,
            name,
            address,
            city,
            latitude,
            longitude,
            status,
        } = query;
        const skip = calculateOffset(page, limit);

        const [items, totalItems] = await Promise.all([
            this.cinemaRepository.findAll(
                q,
                skip,
                limit,
                address,
                name,
                city,
                status,
                latitude,
                longitude,
            ),
            this.cinemaRepository.countCinemas(
                q,
                address,
                name,
                city,
                status,
                latitude,
                longitude,
            ),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return new PaginatedResponse(items, page, totalPages, totalItems);
    }

    async getDetail(id: number): Promise<CinemaDetailResponse> {
        const result = await this.cinemaRepository.findById(id);
        if (!result) {
            throw new NotFoundError('Not found cinema with id: ' + id);
        }
        return {
            id: result?.id,
            name: result?.name,
            address: result?.address,
            city: result?.city,
            longitude: result?.longitude || 0,
            latitude: result?.latitude || 0,
            status: result?.status,
            createdAt: result?.createdAt,
        };
    }

    async createCinema(payload: CreateCinemaDto): Promise<CinemaDetailResponse> {
        const result = await this.cinemaRepository.createCinema(payload);
        return {
            id: result.id,
            name: result.name,
            address: result.address,
            city: result.city,
            longitude: result.longitude || 0,
            latitude: result.latitude || 0,
            status: result.status,
            createdAt: result.createdAt,
        };
    }
    async updateCinema(
        id: number,
        payload: UpdateCinemaDto,
    ): Promise<CinemaDetailResponse> {
        const result = await this.cinemaRepository.updateCinema(id, payload);
        return {
            id: result.id,
            name: result.name,
            address: result.address,
            city: result.city,
            longitude: result.longitude || 0,
            latitude: result.latitude || 0,
            status: result.status,
            createdAt: result.createdAt,
        };
    }

    async deleteCinema(id: number): Promise<CinemaDetailResponse> {
        const result = await this.cinemaRepository.deleteCinema(id);
        return {
            id: result.id,
            name: result.name,
            address: result.address,
            city: result.city,
            longitude: result.longitude || 0,
            latitude: result.latitude || 0,
            status: result.status,
            createdAt: result.createdAt,
        };
    }

    async toggleCinemaStatus(
        id: number,
        status: boolean,
    ): Promise<CinemaDetailResponse> {
        const result = await this.cinemaRepository.toggleCinemaStatus(id, status);
        return {
            id: result.id,
            name: result.name,
            address: result.address,
            city: result.city,
            longitude: result.longitude || 0,
            latitude: result.latitude || 0,
            status: result.status,
            createdAt: result.createdAt,
        };
    }
}
