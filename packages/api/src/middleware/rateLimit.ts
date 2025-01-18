import { middleware } from '../trpc';
import { TRPCError } from '@trpc/server';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export const rateLimitMiddleware = middleware(async ({ ctx, next }) => {
  const result = await new Promise((resolve) => {
    limiter(ctx.req, ctx.res, () => resolve(true));
  });
  
  if (!result) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    });
  }
  
  return next();
}); 