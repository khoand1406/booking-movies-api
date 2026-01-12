import sql from 'mssql';
import logger from '../utils/logger.utils';
import appConfig from './app.config';

export const sqlConfig: sql.config = {
  user: appConfig.database.user,
  password: appConfig.database.password,
  database: appConfig.database.database,
  server: appConfig.database.server,
  port: appConfig.database.port,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export const pool = new sql.ConnectionPool(sqlConfig);

export const testConnection = async () => {
  try {
    if (!sqlConfig.server) throw new Error("SQL Server Host is missing!");
    await pool.connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};