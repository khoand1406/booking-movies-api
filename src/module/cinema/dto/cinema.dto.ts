import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { StringFilter } from "generated/prisma/commonInputTypes";

export class CreateCinemaDto {
    @IsNotEmpty()
    name!: string;
    @IsNotEmpty()
    address!: string;
    @IsNotEmpty()
    city!: string;
    @IsOptional()
    latitude?: number;
    @IsOptional()
    longitude?: number;
    @IsNotEmpty()
    status!: boolean;
}

export class UpdateCinemaDto {
    @IsOptional()
    name?: string;
    @IsOptional()
    address?: string;
    @IsOptional()
    city?: string;
    @IsOptional()
    latitude?: number;
    @IsOptional()
    longitude?: number;
    @IsOptional()
    status?: boolean;
}

export interface CinemaResponseDto {
    id: number;
    name: string;
    address: string;
    city: string;
    status: boolean;
}

export interface CinemaDetailResponse {
    id: number;
    name: string;
    address: string;
    city: string;
    status: boolean;
    longitude: number;
    latitude: number;
    createdAt: Date
}

export class CinemaQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10

    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;
}

