import { z } from 'zod';
const oltCore = {
    name: z.string().min(1, 'OLT name is required'),
    vendor: z.string().min(1, 'Vendor is required'),
    model: z.string().min(1, 'Model is required').optional(),
    ipAddress: z.string().min(1, 'IP Address is required'),
    port: z.string().min(1, 'Port is required').default('23'),
    username: z.string().min(1, 'Username is required'),
    transport: z.enum(['telnet', 'ssh', 'snmp']).default('telnet'),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
    popId: z.string().uuid().optional(),
    location: z.string().optional(),
};
export const createOltSchema = z.object({
    ...oltCore,
    password: z.string().min(1, 'Password is required'),
    portCount: z.coerce.number().int().positive().default(16), // Number of PON ports to generate
});
export const updateOltSchema = z.object({
    name: z.string().min(1, 'OLT name is required').optional(),
    vendor: z.string().min(1, 'Vendor is required').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    ipAddress: z.string().min(1, 'IP Address is required').optional(),
    port: z.string().min(1, 'Port is required').optional(),
    username: z.string().min(1, 'Username is required').optional(),
    password: z.string().min(1, 'Password is required').optional(),
    transport: z.enum(['telnet', 'ssh', 'snmp']).optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).optional(),
    popId: z.string().uuid().optional(),
    location: z.string().optional(),
});
export const oltResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    vendor: z.string(),
    model: z.string().nullable().optional(),
    ipAddress: z.string(),
    port: z.string(),
    username: z.string(),
    transport: z.enum(['telnet', 'ssh', 'snmp']),
    status: z.enum(['active', 'inactive', 'maintenance']),
    popId: z.string().uuid().nullable().optional(),
    location: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    pop: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }).nullable().optional(),
});
export const oltsResponseSchema = z.array(oltResponseSchema);
// Pagination schemas
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const oltsPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: oltsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
// API Response Wrappers
export const oltApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        id: z.string().uuid(),
        ...oltCore,
        createdAt: z.date(),
        updatedAt: z.date(),
    }),
});
export const oltsApiResponseSchema = z.object({
    success: z.boolean(),
    data: oltsResponseSchema,
});
export const deleteOltResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const testConnectionSchema = z.object({
    ipAddress: z.string().min(1, 'IP Address is required'),
    port: z.string().min(1, 'Port is required'),
});
export const testConnectionResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const oltSchemas = {
    createOltSchema,
    updateOltSchema,
    testConnectionSchema,
    testConnectionResponseSchema,
    oltResponseSchema,
    oltsResponseSchema,
    paginationQuerySchema,
    oltsPaginatedApiResponseSchema,
    oltApiResponseSchema,
    oltsApiResponseSchema,
    deleteOltResponseSchema,
};
