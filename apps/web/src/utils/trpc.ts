import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@budget/api';

export const trpc = createTRPCReact<AppRouter>(); 