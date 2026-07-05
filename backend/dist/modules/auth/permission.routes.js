import { z } from 'zod';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { permissionSchemas, } from './permission.schema';
export async function permissionRoutes(server) {
    const permissionRepository = new PermissionRepository();
    const permissionService = new PermissionService(permissionRepository);
    const permissionController = new PermissionController(permissionService);
    server.post('/', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: permissionSchemas.createPermissionSchema,
            response: { 201: permissionSchemas.permissionResponseSchema },
        },
    }, permissionController.createPermission.bind(permissionController));
    server.get('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 200: permissionSchemas.permissionResponseSchema },
        },
    }, permissionController.getPermission.bind(permissionController));
    server.put('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: permissionSchemas.updatePermissionSchema,
            response: { 200: permissionSchemas.permissionResponseSchema },
        },
    }, permissionController.updatePermission.bind(permissionController));
    server.delete('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 204: {} },
        },
    }, permissionController.deletePermission.bind(permissionController));
    server.get('/', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 200: permissionSchemas.permissionsResponseSchema },
        },
    }, permissionController.listPermissions.bind(permissionController));
    server.post('/roles', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: z.object({
                roleId: z.string().uuid(),
                permissionId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                }),
            },
        },
    }, permissionController.assignPermissionToRole.bind(permissionController));
    server.delete('/roles', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: z.object({
                roleId: z.string().uuid(),
                permissionId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                }),
            },
        },
    }, permissionController.removePermissionFromRole.bind(permissionController));
}
