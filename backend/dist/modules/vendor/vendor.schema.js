import { z } from 'zod';
export const createVendorSchema = z.object({
    name: z.string().min(1, 'Vendor name is required').max(255),
    description: z.string().max(255).optional().nullable(),
});
export const updateVendorSchema = z.object({
    name: z.string().min(1, 'Vendor name is required').max(255).optional(),
    description: z.string().max(255).optional().nullable(),
});
export const vendorResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const vendorsResponseSchema = z.array(vendorResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const vendorsPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: z.array(vendorResponseSchema),
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const vendorApiResponseSchema = z.object({
    success: z.boolean(),
    data: vendorResponseSchema,
});
export const vendorsApiResponseSchema = z.object({
    success: z.boolean(),
    data: vendorsResponseSchema,
});
export const deleteVendorResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const vendorSchemas = {
    createVendorSchema,
    updateVendorSchema,
    paginationQuerySchema,
    vendorResponseSchema,
    vendorsResponseSchema,
    vendorsPaginatedApiResponseSchema,
    vendorApiResponseSchema,
    vendorsApiResponseSchema,
    deleteVendorResponseSchema,
};
