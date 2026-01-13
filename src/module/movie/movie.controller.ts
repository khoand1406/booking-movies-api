import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { MovieService } from "./movie.servicey";
import { CreateMovieDTO, MovieQueryDto, UpdateMovieDTO } from "./dto/movie.dto";

@Controller('movies')
export class MovieController{
    constructor(private readonly MovieService: MovieService){}
    
    @Get()
    async getMovies(@Query() query: MovieQueryDto){
        const result= await this.MovieService.getList(query);
        return result;
    }

    @Get(':id')
    async getMovie(@Param('id', ParseIntPipe) id: number){
        return await this.MovieService.getMovie(id);
    }

    @Post()
    async createMovie(@Body() request: CreateMovieDTO){
        return await this.MovieService.createMovie(request);
    }

    @Patch(':id')
    async updateMovie(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateMovieDTO){
        return await this.MovieService.updateMovie(id,payload )
    }

    @Delete(':id')
    async deleteMovie(@Param('id', ParseIntPipe) id: number){
        return await this.MovieService.deleteMovie(id);
    }


}