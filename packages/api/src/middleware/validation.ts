import { middleware } from '../trpc';
import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

export const validationMiddleware = middleware(async ({ next }) => {
  try {
    const result = await next();
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Validation error',
        cause: error.flatten(),
      });
    }
    throw error;
  }
});

export const requestValidationMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.req.headers['content-type']?.includes('application/json')) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Content-Type must be application/json',
    });
  }

  const contentLength = parseInt(ctx.req.headers['content-length'] || '0', 10);
  if (contentLength > 1024 * 1024) { // 1MB limit
    throw new TRPCError({
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request payload too large',
    });
  }

  return next();
}); 