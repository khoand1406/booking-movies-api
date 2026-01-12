import { Injectable } from '@nestjs/common';
import { Cinema } from 'generated/prisma/client';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CinemaRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(
        q?: string,
        skip?: number,
        take?: number,
        address?: string,
        name?: string,
        city?: string,
        status?: boolean,
        latitude?: number,
        longitude?: number,
    ): Promise<Cinema[]> {
        const where = this.buildWhereCondition(q, address, name, city, longitude, latitude, status)
        return this.prisma.cinema.findMany({
            skip,
            take,
            where,
        });
    }

    async findById(id: number): Promise<Cinema | null> {
        const result = await this.prisma.cinema.findUnique({
            where: { id },
        });
        return result;
    }
    async createCinema(payload: CreateCinemaDto): Promise<Cinema> {
        const newCinema = await this.prisma.cinema.create({
            data: payload,
        });
        return newCinema;
    }

    async updateCinema(id: number, payload: UpdateCinemaDto): Promise<Cinema> {
        const updatedCinema = await this.prisma.cinema.update({
            where: { id },
            data: payload,
        });

        return updatedCinema;
    }

    async deleteCinema(id: number): Promise<Cinema> {
        const deleteCinema = await this.prisma.cinema.delete({
            where: { id },
        });
        return deleteCinema;
    }
    async countCinemas(
        q?: string,
        address?: string,
        name?: string,
        city?: string,
        status?: boolean,
        latitude?: number,
        longitude?: number,
    ): Promise<number> {
        const where = this.buildWhereCondition(q, address, name, city, longitude, latitude, status)
        return this.prisma.cinema.count({ where });
    }

    async toggleCinemaStatus(id: number, status: boolean): Promise<Cinema> {
        const updatedCinnema = await this.prisma.cinema.update({
            where: { id },
            data: { status: status },
        });
        return updatedCinnema;
    }

    private buildWhereCondition(
        q?: string,
        address?: string,
        name?: string,
        city?: string,
        longitude?: number,
        latitude?: number,
        status?: boolean,
    ) {
        const where: any = {};
        if (q !== undefined) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { address: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (address !== undefined) {
            where.address = {
                contains: address,
                mode: 'insensitive',
            };
        }

        if (name !== undefined) {
            where.name = {
                contains: name,
                mode: 'insensitive',
            };
        }

        if (city !== undefined) {
            where.city = {
                contains: city,
                mode: 'insensitive',
            };
        }

        if (status !== undefined) {
            where.status = status;
        }

        if (latitude !== undefined) {
            where.latitude = latitude;
        }

        if (longitude !== undefined) {
            where.longitude = longitude;
        }
        return where;
    }
}
