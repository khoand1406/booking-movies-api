import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class UploadService {
    async uploadFile(buffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'bookings-movies',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url ?? '');
                },
            );
            stream.end(buffer);
        })

    }
}