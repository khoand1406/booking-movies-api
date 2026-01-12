import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import appConfig from './config/app.config';
import { testConnection } from './config/database.config';
import logger from './utils/logger.utils';

async function bootstrap() {
  try {
    await testConnection();
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AppExceptionFilter());

    await app.listen(appConfig.port ?? 3000);
    logger.info(
      `Server running on http://localhost:${appConfig.port ?? 3000}`,
    );
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1);
  }
}
bootstrap();
