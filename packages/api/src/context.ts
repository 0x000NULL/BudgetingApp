import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@budget/database';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { env } from '@budget/core';
import { randomUUID } from 'crypto';

export async function createContext({ req, res }: CreateNextContextOptions) {
  const requestId = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', requestId);

  let user = null;
  
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }
  }

  // Add error handling for missing user
  if (token && !user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  // Add request validation
  if (!req.headers['accept']) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Missing Accept header',
    });
  }

  return {
    req,
    res,
    prisma,
    user,
    requestId,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>; 