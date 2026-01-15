import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { CreateShowtimeDTO, ShowtimeQuery, UpdateShowtimeDTO } from "./dto/showtime.dto";
import { ShowtimeService } from "./showtime.service";

@Controller('showtimes')
export class ShowTimeController{
    constructor(private readonly showTimeService: ShowtimeService){}
    
    @Get()
    async getList(@Query() query: ShowtimeQuery){
        return this.showTimeService.getShowtimes(query)
    }

    @Post()
    async create(@Body() request: CreateShowtimeDTO){
        return this.showTimeService.createShowtime(request);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() request: UpdateShowtimeDTO){
        return this.showTimeService.updateShowTime(id, request);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.showTimeService.deleteShowtime(id);
    }
}