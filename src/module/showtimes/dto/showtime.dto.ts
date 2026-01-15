export enum ShowtimeStatus {
    OPEN= 'OPEN',
    CLOSED= 'CLOSED',
    SHOWING= 'SHOWING',
    CANCELLED= 'CANCELLED'
}
export interface CreateShowtimeDTO {
    cinemaId: number
    roomCode: string
    startTime: Date
    endTime: Date
    basePrice: string
    status: string,
    movieId: number,
}

export interface UpdateShowtimeDTO {
    cinemaId: number
    roomCode: string
    startTime: Date
    endTime: Date
    basePrice?: string
    status?: string,
    movieId?: number,
}

export class ShowtimeQuery {
    page?: number
    limit?: number
    q?: string
    startTime?: Date
    endTime?: Date
    movieId?: number
    cinemaId?: number
    status?: string
}

export interface ShowtimeResponse {
    id: number;

    startTime: Date;
    endTime: Date;

    basePrice: number;
    status: string;

    movie: {
        id: number;
        title: string;
        duration?: number;
    };

    room: {
        id: number;
        code: string;
        cinemaId: number;
        name?: string;
    };
};

