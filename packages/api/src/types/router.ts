import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../procedures/root';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;