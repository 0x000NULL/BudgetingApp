import { z } from 'zod';
import { router } from '../trpc';
import { protectedProcedure } from '../middleware/auth';
import { budgetSchema } from '@budget/core';
import { AppError, ErrorCode } from '@budget/core';

export const budgetRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.prisma.budget.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        category: true,
      },
    });
    return budgets;
  }),

  create: protectedProcedure
    .input(budgetSchema)
    .mutation(async ({ ctx, input }) => {
      // Validate start date is before end date
      if (input.startDate >= input.endDate) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Start date must be before end date'
        );
      }

      // Check if category exists and belongs to user
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

      const budget = await ctx.prisma.budget.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
      return budget;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: budgetSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First check if budget exists and belongs to user
      const existingBudget = await ctx.prisma.budget.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!existingBudget) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Budget not found'
        );
      }

      const budget = await ctx.prisma.budget.update({
        where: { id: input.id },
        data: input.data,
      });
      return budget;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const budget = await ctx.prisma.budget.delete({
        where: {
          id: input,
          userId: ctx.user.id,
        },
      });
      return budget;
    }),
}); 