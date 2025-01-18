import { z } from 'zod';
import { router } from '../trpc';
import { publicProcedure } from '../trpc';
import { userSchema } from '@budget/core';
import { TRPCError } from '@trpc/server';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '@budget/core';
import { AppError } from '@budget/core';
import { ErrorCode } from '@budget/core';

export const authRouter = router({
  register: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const hashedPassword = await argon2.hash(input.password);
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: hashedPassword
        },
      });

      return { user };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw new AppError(
            ErrorCode.NOT_FOUND,
            'Invalid credentials'
          );
        }

        const isValidPassword = await argon2.verify(user.password, input.password);
        if (!isValidPassword) {
          throw new AppError(
            ErrorCode.UNAUTHORIZED,
            'Invalid credentials'
          );
        }

        // Add rate limiting for failed attempts
        return { user };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
          ErrorCode.INTERNAL_ERROR,
          'Login failed'
        );
      }
    }),

  refresh: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      const token = jwt.sign(
        { userId: ctx.user.id },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token };
    }),

  logout: protectedProcedure
    .mutation(async () => {
      // Implement token blacklisting if needed
      return { success: true };
    }),
}); 