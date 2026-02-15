import { z } from 'zod';

export const accountInputSchema = z.object({
  name: z.string().min(1),
  currency: z.string().length(3),
  type: z.enum(['checking', 'savings', 'credit', 'cash']),
  initialBalanceMinor: z.number().int()
});

export const transactionInputSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().min(1),
  dateISO: z.string().min(10),
  amountMinor: z.number().int(),
  categoryId: z.string().optional(),
  payee: z.string().default(''),
  note: z.string().default(''),
  tagsJson: z.string().default('[]'),
  cleared: z.boolean().default(false)
});
