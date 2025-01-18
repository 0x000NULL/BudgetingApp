import { z } from 'zod';
import { router } from '../trpc';
import { protectedProcedure } from '../middleware/auth';
import { categorySchema } from '@budget/core';
import { AppError, ErrorCode } from '@budget/core';

export const categoryRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
    return categories;
  }),

  create: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
      return category;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: categorySchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if category exists and belongs to user
      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!existingCategory) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Category not found'
        );
      }

      const category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: input.data,
      });
      return category;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Check for existing transactions
      const transactionCount = await ctx.prisma.transaction.count({
        where: {
          categoryId: input,
          userId: ctx.user.id,
        },
      });

      if (transactionCount > 0) {
        throw new AppError(
          ErrorCode.CONFLICT,
          'Cannot delete category with existing transactions'
        );
      }

      const category = await ctx.prisma.category.delete({
        where: {
          id: input,
          userId: ctx.user.id,
        },
      });
      return category;
    }),
}); 