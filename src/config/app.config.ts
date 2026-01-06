import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.baseUrl || `http://localhost:${process.env.PORT || 3000}`,
  },
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
  }
};

export default appConfig;
