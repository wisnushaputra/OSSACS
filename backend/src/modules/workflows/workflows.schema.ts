import { z } from 'zod';

export const workflowStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']);
export const workflowStepStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED']);

export const workflowStepResponseSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string().uuid(),
  stepName: z.string(),
  status: workflowStepStatusEnum,
  order: z.string(),
  inputData: z.any().nullable().optional(),
  outputData: z.any().nullable().optional(),
  error: z.string().nullable().optional(),
  startedAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const workflowResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: workflowStatusEnum,
  triggeredBy: z.string().uuid().nullable().optional(),
  onuId: z.string().uuid().nullable().optional(),
  customerId: z.string().uuid().nullable().optional(),
  oltId: z.string().uuid().nullable().optional(),
  startedAt: z.date(),
  completedAt: z.date().nullable().optional(),
  updatedAt: z.date(),
  steps: z.array(workflowStepResponseSchema).optional(),
});

export const workflowsResponseSchema = z.array(workflowResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const workflowSearchQuerySchema = paginationQuerySchema.extend({
  onuId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  oltId: z.string().uuid().optional(),
  status: workflowStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const workflowsPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: workflowsResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const workflowApiResponseSchema = z.object({
  success: z.boolean(),
  data: workflowResponseSchema,
});

export type WorkflowSearchQuery = z.infer<typeof workflowSearchQuerySchema>;

export const workflowSchemas = {
  workflowResponseSchema,
  workflowsResponseSchema,
  workflowStepResponseSchema,
  paginationQuerySchema,
  workflowSearchQuerySchema,
  workflowsPaginatedApiResponseSchema,
  workflowApiResponseSchema,
};
