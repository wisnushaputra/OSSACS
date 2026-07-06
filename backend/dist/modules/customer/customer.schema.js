import { z } from 'zod';
const customerCore = {
    customerCode: z.string().min(1, 'Customer code is required'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.enum(['Active', 'Suspended', 'Inactive']).default('Active'),
};
export const createCustomerSchema = z.object({
    ...customerCore,
});
export const updateCustomerSchema = z.object({
    fullName: z.string().min(1, 'Full name is required').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.enum(['Active', 'Suspended', 'Inactive']).optional(),
});
export const customerResponseSchema = z.object({
    id: z.string().uuid(),
    ...customerCore,
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const customersResponseSchema = z.array(customerResponseSchema);
export const customerSearchSchema = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
// API Response Wrappers
export const customerApiResponseSchema = z.object({
    success: z.boolean(),
    data: customerResponseSchema,
});
export const customersApiResponseSchema = z.object({
    success: z.boolean(),
    data: customersResponseSchema,
});
export const customersPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: z.array(customerResponseSchema),
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const deleteCustomerResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export const customerSchemas = {
    createCustomerSchema,
    updateCustomerSchema,
    customerSearchSchema,
    paginationQuerySchema,
    customerResponseSchema,
    customersResponseSchema,
    customerApiResponseSchema,
    customersApiResponseSchema,
    customersPaginatedApiResponseSchema,
    deleteCustomerResponseSchema,
};
