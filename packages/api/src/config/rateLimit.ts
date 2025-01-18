import { env } from '@budget/core';

export const rateLimitConfig = {
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  authenticated: {
    windowMs: 15 * 60 * 1000,
    max: 1000, // higher limit for authenticated users
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit signup attempts
  },
} as const; 