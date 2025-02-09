import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3000'),
  MONGODB_URI: z.string().url().default('mongodb://localhost:27017/inventory'),
  JWT_SECRET: z.string().min(32).default('your-default-secret-key-that-is-at-least-32-chars'),
  REFRESH_SECRET: z.string().min(32).default('your-refresh-secret-key-that-is-at-least-32-chars'),
  DEFAULT_PAGE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('10'),
  MAX_PAGE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('100')
});

export type EnvConfig = z.infer<typeof envSchema>;

export default registerAs('app', () => {
  const env = envSchema.parse(process.env);
  
  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    mongodbUri: env.MONGODB_URI,
    jwtSecret: env.JWT_SECRET,
    refreshSecret: env.REFRESH_SECRET,
    defaultPageSize: env.DEFAULT_PAGE_SIZE,
    maxPageSize: env.MAX_PAGE_SIZE
  };
});
