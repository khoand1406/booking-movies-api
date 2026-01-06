import { Body, Controller, Get, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { currentUser } from 'src/common/decorators/current-user.decorator';
import { JWTAuthGuard } from 'src/common/guard/auth.guard';
import { UpdateProfileRequest } from '../auth/dto/login.dto';
import { UploadService } from '../upload/upload.service';
import { UserService } from './user.service';

@UseGuards(JWTAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService,
    ) { }

    @Get('me')
    async getProfile(@currentUser() user) {
        const result = await this.userService.getUserProfile(user.id);
        return result;
    }

    @Put('profile')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(
        @currentUser() user,
        @Body() body: UpdateProfileRequest,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let avatarUrl: string | undefined;

        if (file) {
            avatarUrl = await this.uploadService.uploadFile(file.buffer);
        }

        return this.userService.updateProfile(user, {
            ...body,
            avatar: avatarUrl,
        });
    }
}
