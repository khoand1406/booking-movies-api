import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UploadService } from "../upload/upload.service";

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository, UploadService],
    exports: [UserService],
})
export class UserModule{}