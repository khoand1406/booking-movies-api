import { Type } from 'class-transformer';
import {
    IS_NOT_EMPTY,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Max,
    Min,
    MinLength,
} from 'class-validator';

export enum MovieStatus {
    NOW_SHOWING = 'NOW_SHOWING',
    COMING_SOON = 'COMING_SOON',
    STOP = 'STOP',
}

export interface MovieResponseDTO {
    id: number;
    title: string;
    durationMinutes: number;
    description: string;
    language: string;
    endDate: Date | null;
    posterUrl: string;
    releaseDate: Date;
    status: string;
    slug: string;
}

export interface MovieDetailResponseDTO {
    id: number;
    title: string;
    durationMinutes: number;
    description: string;
    language: string;
    endDate: Date | null;
    posterUrl: string;
    trailerUrl: string | null;
    releaseDate: Date;
    status: string;
    slug: string;
    updatedAt: Date | null
}

export class CreateMovieDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    title!: string;

    @IsNotEmpty()
    @IsEnum(MovieStatus)
    status!: MovieStatus;

    @IsNotEmpty()
    @IsString()
    slug!: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    durationMinutes!: number;

    @IsNotEmpty()
    @IsString()
    language!: string;

    @IsNotEmpty()
    @IsDateString()
    releaseDate!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating?: number | null;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsUrl()
    posterUrl!: string;

    @IsOptional()
    @IsUrl()
    trailerUrl?: string | null;
}
export class  UpdateMovieDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    title!: string;

    @IsNotEmpty()
    @IsEnum(MovieStatus)
    status!: MovieStatus;

    @IsNotEmpty()
    @IsString()
    slug!: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    durationMinutes!: number;

    @IsNotEmpty()
    @IsString()
    language!: string;

    @IsNotEmpty()
    @IsDateString()
    releaseDate!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating?: number | null;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsUrl()
    posterUrl!: string;

    @IsOptional()
    @IsUrl()
    trailerUrl?: string | null;

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
