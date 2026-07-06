import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bcms_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  deviceParametersRetentionDays: parseInt(process.env.DEVICE_PARAMETERS_RETENTION_DAYS || '30', 10),
  opticalHistoryRetentionDays: parseInt(process.env.OPTICAL_HISTORY_RETENTION_DAYS || '90', 10),
  dashboardSummaryCacheTtl: parseInt(process.env.DASHBOARD_SUMMARY_CACHE_TTL || '60', 10),
};
