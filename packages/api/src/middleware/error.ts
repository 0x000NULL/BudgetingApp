import { middleware } from '../trpc';
import { TRPCError } from '@trpc/server';
import { env } from '@budget/core';
import Sentry from '@sentry/node/renderer';

export const errorMiddleware = middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    
    console.error('Unhandled error:', error);
    
    // Log to error tracking service
    if (env.SENTRY_DSN) {
      Sentry.captureException(error);
    }
    
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      cause: error,
    });
  }
}); 