import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
});

export const env = envSchema.parse(process.env); 