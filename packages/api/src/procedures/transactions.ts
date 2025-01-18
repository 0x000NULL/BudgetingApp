import { z } from 'zod';
import { router } from '../trpc';
import { protectedProcedure } from '../middleware/auth';
import { transactionSchema } from '@budget/core';
import { AppError, ErrorCode } from '@budget/core';

export const transactionRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const transactions = await ctx.prisma.transaction.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { userId: ctx.user.id },
        orderBy: { date: 'desc' },
        include: { category: true },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (transactions.length > input.limit) {
        const nextItem = transactions.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: transactions,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify category exists and belongs to user
      const category = await ctx.prisma.category.findFirst({
        where: {
          id: input.categoryId,
          userId: ctx.user.id,
        },
      });

      if (!category) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Category not found'
        );
      }

      const transaction = await ctx.prisma.transaction.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
        include: { category: true },
      });
      return transaction;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.delete({
        where: {
          id: input,
          userId: ctx.user.id,
        },
      });
      return transaction;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: transactionSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.update({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data: input.data,
      });
      return transaction;
    }),
}); 