import { z } from 'zod';

export const jobStatusEnum = z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'FAILED', 'DELAYED', 'RETRYING']);

export const jobResponseSchema = z.object({
  id: z.string().uuid(),
  jobName: z.string(),
  status: jobStatusEnum,
  data: z.any().nullable().optional(),
  result: z.any().nullable().optional(),
  error: z.string().nullable().optional(),
  attempts: z.number().int(),
  startedAt: z.date().nullable().optional(),
  finishedAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const jobsResponseSchema = z.array(jobResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const jobSearchQuerySchema = paginationQuerySchema.extend({
  jobName: z.string().optional(),
  status: jobStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const jobsPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: jobsResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const jobApiResponseSchema = z.object({
  success: z.boolean(),
  data: jobResponseSchema,
});

export type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;

export const jobSchemas = {
  jobResponseSchema,
  jobsResponseSchema,
  paginationQuerySchema,
  jobSearchQuerySchema,
  jobsPaginatedApiResponseSchema,
  jobApiResponseSchema,
};
