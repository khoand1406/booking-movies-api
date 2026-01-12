import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const appConfig = {
  server: process.env.BASE_URL || `http://localhost:${port}`,
  port: port,
  database: {
    url: process.env.DATABASE_URL || '',
    server: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  cloud: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};


export default appConfig;
