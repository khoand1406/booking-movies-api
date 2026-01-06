export class BaseResponse<T>{
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data: T
    ){}
}

export class PaginatedResponse<T>{
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data: T[],
        public readonly currentPage: number,
        public readonly totalPages: number,
        public readonly totalItems: number
    ){}
}

export class ErrorResponse{
    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        public readonly message: string,
        public readonly stackTrace?: string
    ){}
}