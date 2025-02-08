import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory',
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
  defaultPageSize: 10,
  maxPageSize: 100
};
