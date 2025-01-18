import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const transactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  categoryId: z.string(),
  date: z.date(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  icon: z.string(),
});

export const budgetSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  categoryId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
}); 