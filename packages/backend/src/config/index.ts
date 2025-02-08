import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3000'),
  MONGODB_URI: z.string().url().default('mongodb://localhost:27017/inventory'),
  JWT_SECRET: z.string().min(32).default('your-default-secret-key-that-is-at-least-32-chars'),
  DEFAULT_PAGE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('10'),
  MAX_PAGE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('100')
});

const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongodbUri: env.MONGODB_URI,
  jwtSecret: env.JWT_SECRET,
  defaultPageSize: env.DEFAULT_PAGE_SIZE,
  maxPageSize: env.MAX_PAGE_SIZE
} as const;

// Type for the config object
export type Config = typeof config;
