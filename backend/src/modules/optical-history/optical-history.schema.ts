import { z } from 'zod';

export const opticalHistoryResponseSchema = z.object({
  id: z.string().uuid(),
  onuId: z.string().uuid(),
  rxPower: z.string().nullable().optional(),
  txPower: z.string().nullable().optional(),
  createdAt: z.date(),
});

export const opticalHistoriesResponseSchema = z.array(opticalHistoryResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const opticalHistorySearchQuerySchema = paginationQuerySchema.extend({
  onuId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const opticalHistoriesPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: opticalHistoriesResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const opticalHistoryApiResponseSchema = z.object({
  success: z.boolean(),
  data: opticalHistoryResponseSchema,
});

export type OpticalHistorySearchQuery = z.infer<typeof opticalHistorySearchQuerySchema>;

export const opticalHistorySchemas = {
  opticalHistoryResponseSchema,
  opticalHistoriesResponseSchema,
  paginationQuerySchema,
  opticalHistorySearchQuerySchema,
  opticalHistoriesPaginatedApiResponseSchema,
  opticalHistoryApiResponseSchema,
};
