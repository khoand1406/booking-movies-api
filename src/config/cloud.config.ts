import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import appConfig from 'src/config/app.config';
export const upload = multer({ storage: multer.memoryStorage() });
cloudinary.config({
    cloud_name: appConfig.cloud.cloudName,
    api_key: appConfig.cloud.apiKey,
    api_secret: appConfig.cloud.apiSecret,
});
