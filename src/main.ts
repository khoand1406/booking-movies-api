import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { testConnection } from './config/database.config';
import logger from './utils/logger.utils';

async function bootstrap() {
  try {
    await testConnection();
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    logger.info(
      `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1);
  }
}
bootstrap();
