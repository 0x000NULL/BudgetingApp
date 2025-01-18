import { router } from '../trpc';
import { authRouter } from './auth';
import { transactionRouter } from './transactions';
import { categoryRouter } from './categories';
import { budgetRouter } from './budgets';
import { logger } from '../services/logger';

export const appRouter = router({
  auth: authRouter,
  transactions: transactionRouter,
  categories: categoryRouter,
  budgets: budgetRouter,
})._def.router.use(({ path, type, next }) => {
  return next().catch((error) => {
    logger.error(`Error in ${type} ${path}`, { error });
    throw error;
  });
});

export type AppRouter = typeof appRouter;