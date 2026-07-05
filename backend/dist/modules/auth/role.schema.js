import { z } from 'zod';
const roleCore = {
    name: z.string().min(1, 'Role name is required'),
    description: z.string().optional(),
};
const createRoleSchema = z.object({
    ...roleCore,
});
const updateRoleSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
});
const roleResponseSchema = z.object({
    id: z.string().uuid(),
    ...roleCore,
    createdAt: z.date(),
    updatedAt: z.date(),
});
const rolesResponseSchema = z.array(roleResponseSchema);
export const roleSchemas = {
    createRoleSchema,
    updateRoleSchema,
    roleResponseSchema,
    rolesResponseSchema,
};
