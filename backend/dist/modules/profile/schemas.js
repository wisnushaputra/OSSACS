import { z } from 'zod';
const base = {
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(1000).optional().nullable(),
};
export const profileTypeSchema = z.enum(['line', 'service', 'dba', 'vlan']);
export const createProfileSchema = z.object({
    ...base,
    type: profileTypeSchema,
});
export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.string().max(1000).optional().nullable(),
    type: profileTypeSchema.optional(),
});
export const profileResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: profileTypeSchema,
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const profilesResponseSchema = z.array(profileResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const profilesPaginatedResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: profilesResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const profileApiResponseSchema = z.object({
    success: z.boolean(),
    data: profileResponseSchema,
});
export const deleteProfileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const profileSchemas = {
    profileTypeSchema,
    createProfileSchema,
    updateProfileSchema,
    profileResponseSchema,
    profilesResponseSchema,
    paginationQuerySchema,
    profilesPaginatedResponseSchema,
    profileApiResponseSchema,
    deleteProfileResponseSchema,
};
