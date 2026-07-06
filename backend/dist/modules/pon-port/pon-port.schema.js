import { z } from 'zod';
const ponPortCore = {
    name: z.string().min(1, 'PON Port name is required'),
    portNumber: z.number().int().positive(),
    maxOnu: z.number().int().positive().default(128),
    description: z.string().optional().nullable(),
};
export const updatePonPortSchema = z.object({
    description: z.string().optional().nullable(),
    maxOnu: z.number().int().positive().optional(),
});
export const ponPortResponseSchema = z.object({
    id: z.string().uuid(),
    oltId: z.string().uuid(),
    ...ponPortCore,
    activeOnus: z.number().int().min(0).default(0),
    availableSlots: z.number().int().min(0).default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const ponPortsResponseSchema = z.array(ponPortResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
// API Response Wrappers
export const ponPortApiResponseSchema = z.object({
    success: z.boolean(),
    data: ponPortResponseSchema,
});
export const ponPortsApiResponseSchema = z.object({
    success: z.boolean(),
    data: ponPortsResponseSchema,
});
export const ponPortsPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: ponPortsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const ponPortSchemas = {
    updatePonPortSchema,
    ponPortResponseSchema,
    ponPortsResponseSchema,
    paginationQuerySchema,
    ponPortApiResponseSchema,
    ponPortsApiResponseSchema,
    ponPortsPaginatedApiResponseSchema,
};
