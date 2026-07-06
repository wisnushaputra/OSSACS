import { z } from 'zod';
export const eventLogResponseSchema = z.object({
    id: z.string().uuid(),
    eventType: z.string(),
    description: z.string().nullable().optional(),
    customerId: z.string().uuid().nullable().optional(),
    onuId: z.string().uuid().nullable().optional(),
    oltId: z.string().uuid().nullable().optional(),
    workflowId: z.string().uuid().nullable().optional(),
    createdAt: z.date(),
});
export const eventLogsResponseSchema = z.array(eventLogResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const createEventLogSchema = z.object({
    eventType: z.string().min(1),
    description: z.string().optional().nullable(),
    customerId: z.string().uuid().optional().nullable(),
    onuId: z.string().uuid().optional().nullable(),
    oltId: z.string().uuid().optional().nullable(),
    workflowId: z.string().uuid().optional().nullable(),
});
export const eventSearchQuerySchema = paginationQuerySchema.extend({
    customerId: z.string().uuid().optional(),
    onuId: z.string().uuid().optional(),
    oltId: z.string().uuid().optional(),
    workflowId: z.string().uuid().optional(),
    eventType: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
export const eventLogsPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: eventLogsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const eventSchemas = {
    eventLogResponseSchema,
    eventLogsResponseSchema,
    paginationQuerySchema,
    createEventLogSchema,
    eventSearchQuerySchema,
    eventLogsPaginatedApiResponseSchema,
};
