import { z } from 'zod';
const onuCore = {
    customerId: z.string().uuid('Invalid customer ID'),
    oltId: z.string().uuid('Invalid OLT ID'),
    serialNumber: z.string().max(255).min(1, 'Serial Number is required'),
    genieDeviceId: z.string().max(255).min(1, 'Genie Device ID is required'),
    ponPort: z.string().max(255).min(1, 'PON Port is required'), // e.g., "PON 1", "0/0/1"
    onuId: z.coerce.number().int().min(1, 'ONU ID must be positive'),
    profileName: z.string().max(255).min(1, 'Profile Name is required'),
    vlan: z.coerce.number().int().min(1, 'VLAN must be positive'),
    firmware: z.string().max(255).optional().nullable(),
    model: z.string().max(255).optional().nullable(),
    manufacturer: z.string().max(255).optional().nullable(),
};
export const createOnuSchema = z.object({
    ...onuCore,
});
export const updateOnuSchema = z.object({
    customerId: z.string().uuid('Invalid customer ID').optional(),
    oltId: z.string().uuid('Invalid OLT ID').optional(),
    serialNumber: z.string().max(255).min(1, 'Serial Number is required').optional(),
    genieDeviceId: z.string().max(255).min(1, 'Genie Device ID is required').optional(),
    ponPort: z.string().max(255).min(1, 'PON Port is required').optional(),
    onuId: z.coerce.number().int().min(1, 'ONU ID must be positive').optional(),
    profileName: z.string().max(255).min(1, 'Profile Name is required').optional(),
    vlan: z.coerce.number().int().min(1, 'VLAN must be positive').optional(),
    firmware: z.string().max(255).optional().nullable(),
    model: z.string().max(255).optional().nullable(),
    manufacturer: z.string().max(255).optional().nullable(),
});
export const onuResponseSchema = z.object({
    id: z.string().uuid(),
    ...onuCore,
    registeredAt: z.date(),
    deletedAt: z.date().nullable(),
    customer: z.object({
        id: z.string().uuid(),
        fullName: z.string(),
        customerCode: z.string(),
    }).optional(),
    olt: z.object({
        id: z.string().uuid(),
        name: z.string(),
        ipAddress: z.string(),
    }).optional(),
});
export const onusResponseSchema = z.array(onuResponseSchema);
// Pagination schemas
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const onuSearchQuerySchema = z.object({
    q: z.string().optional(),
    customerId: z.string().uuid().optional(),
    oltId: z.string().uuid().optional(),
    vendor: z.string().optional(),
    status: z.string().optional(),
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const onusPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: onusResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
// API Response Wrappers
export const onuApiResponseSchema = z.object({
    success: z.boolean(),
    data: onuResponseSchema,
});
export const deleteOnuResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const onuSchemas = {
    createOnuSchema,
    updateOnuSchema,
    onuResponseSchema,
    onusResponseSchema,
    paginationQuerySchema,
    onuSearchQuerySchema,
    onusPaginatedApiResponseSchema,
    onuApiResponseSchema,
    deleteOnuResponseSchema,
};
