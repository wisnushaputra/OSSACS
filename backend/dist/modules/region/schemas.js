import { z } from 'zod';
const base = {
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(1000).optional().nullable(),
};
export const createRegionSchema = z.object({
    ...base,
});
export const updateRegionSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.string().max(1000).optional().nullable(),
});
export const regionResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const regionsResponseSchema = z.array(regionResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const regionsPaginatedResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: regionsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const regionApiResponseSchema = z.object({
    success: z.boolean(),
    data: regionResponseSchema,
});
export const deleteRegionResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const regionSchemas = {
    createRegionSchema,
    updateRegionSchema,
    regionResponseSchema,
    regionsResponseSchema,
    paginationQuerySchema,
    regionsPaginatedResponseSchema,
    regionApiResponseSchema,
    deleteRegionResponseSchema,
};
