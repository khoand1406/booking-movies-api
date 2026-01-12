import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export interface MovieResponseDTO { }

export interface MovieDetailResponseDTO { }

export interface CreateMovieDTO { }
export interface UpdateMovieDTO { }

export enum MovieStatus {
    NOW_SHOWING = 'NOW_SHOWING',
    COMING_SOON = 'COMING_SOON',
    STOP = 'STOP',
}

export class MovieQueryDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsEnum(MovieStatus)
    status?: MovieStatus;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    durationMinutes?: number;

    @IsOptional()
    @IsDateString()
    releaseDate?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(10)
    rating?: number;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    sortBy?: 'releaseDate' | 'createdAt' | 'rating';

    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc';
}