import { z } from 'zod';
const base = {
    name: z.string().min(1, 'Name is required').max(255),
    regionId: z.string().uuid('Region ID must be a UUID'),
    description: z.string().max(1000).optional().nullable(),
};
export const createPopSchema = z.object({
    ...base,
});
export const updatePopSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    regionId: z.string().uuid('Region ID must be a UUID').optional(),
    description: z.string().max(1000).optional().nullable(),
});
export const popResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    regionId: z.string().uuid(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    region: z
        .object({
        id: z.string().uuid(),
        name: z.string(),
    })
        .optional(),
});
export const popsResponseSchema = z.array(popResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const popsPaginatedResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: popsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const popApiResponseSchema = z.object({
    success: z.boolean(),
    data: popResponseSchema,
});
export const deletePopResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const popSchemas = {
    createPopSchema,
    updatePopSchema,
    popResponseSchema,
    popsResponseSchema,
    paginationQuerySchema,
    popsPaginatedResponseSchema,
    popApiResponseSchema,
    deletePopResponseSchema,
};
