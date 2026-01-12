import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CinemaQueryDto, CreateCinemaDto, UpdateCinemaDto } from "./dto/cinema.dto";

@Controller('cinema')
export class CinemaController{
    constructor(private readonly cinemaService: CinemaService){
    }
    @Get()
    async getAll(@Query() query: CinemaQueryDto){
        return this.cinemaService.findAll(query);
    }
    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number ){
        return this.cinemaService.getDetail(id);
    }
    @Post()
    async createCinema(@Body() request: CreateCinemaDto){
        return this.cinemaService.createCinema(request);
    }
    @Put(':id')
    async updateCinema(@Param('id', ParseIntPipe) id: number, @Body() request: UpdateCinemaDto){
        return this.cinemaService.updateCinema(id, request);
    }
    @Delete(':id')
    async deleteCinema(@Param('id', ParseIntPipe) id: number){
        return this.cinemaService.deleteCinema(id);
    }
    @Patch(':id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: {status: boolean}){
        return this.cinemaService.toggleCinemaStatus(id, body.status)
    }
}