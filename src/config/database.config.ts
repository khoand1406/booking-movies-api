import sql from 'mssql';
import logger from '../utils/logger.utils';
import appConfig from './app.config';

const sqlConfig = {
  ...appConfig.database,
  options: {
    ...appConfig.database.options,
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(sqlConfig);

const testConnection = async () => {
  try {
    await pool.connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};

export { pool, testConnection };