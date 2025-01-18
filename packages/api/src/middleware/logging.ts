import { middleware } from '../trpc';
import { logger } from '../utils/logger';

export const loggingMiddleware = middleware(async ({ ctx, path, type, next }) => {
  const start = Date.now();
  
  logger.info('Request started', {
    requestId: ctx.requestId,
    path,
    type,
    userId: ctx.user?.id,
  });

  try {
    const result = await next();
    const durationMs = Date.now() - start;

    logger.info('Request completed', {
      requestId: ctx.requestId,
      path,
      type,
      durationMs,
      userId: ctx.user?.id,
    });

    if (durationMs > 1000) {
      logger.warn('Slow request detected', {
        requestId: ctx.requestId,
        path,
        type,
        durationMs,
      });
    }

    return result;
  } catch (error) {
    logger.error('Request failed', {
      requestId: ctx.requestId,
      path,
      type,
      error,
      userId: ctx.user?.id,
    });
    throw error;
  }
}); 