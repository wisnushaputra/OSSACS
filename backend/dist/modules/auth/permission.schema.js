import { z } from 'zod';
const permissionCore = {
    name: z.string().min(1, 'Permission name is required'),
    description: z.string().optional(),
};
const createPermissionSchema = z.object({
    ...permissionCore,
});
const updatePermissionSchema = z.object({
    ...permissionCore,
    id: z.string().uuid(),
});
const permissionResponseSchema = z.object({
    id: z.string().uuid(),
    ...permissionCore,
    createdAt: z.date(),
});
const permissionsResponseSchema = z.array(permissionResponseSchema);
export const permissionSchemas = {
    createPermissionSchema,
    updatePermissionSchema,
    permissionResponseSchema,
    permissionsResponseSchema,
};
