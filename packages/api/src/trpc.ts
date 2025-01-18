import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import { AppError } from './types/errors';
import { loggingMiddleware, requestValidationMiddleware, rateLimitMiddleware, authMiddleware } from './middlewares';
import { rateLimitConfig } from './config';

const t = initTRPC.context<Context>().create();

// Base procedure with common middleware
const procedure = t.procedure
  .use(loggingMiddleware)
  .use(requestValidationMiddleware);

// Public procedure with rate limiting
export const publicProcedure = procedure
  .use(rateLimitMiddleware(rateLimitConfig.public));

// Protected procedure with auth and higher rate limits
export const protectedProcedure = procedure
  .use(authMiddleware)
  .use(rateLimitMiddleware(rateLimitConfig.authenticated)); 