import { z } from 'zod';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { roleSchemas } from './role.schema';
export async function roleRoutes(server) {
    const roleRepository = new RoleRepository();
    const roleService = new RoleService(roleRepository);
    const roleController = new RoleController(roleService);
    server.post('/', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: roleSchemas.createRoleSchema,
            response: { 201: roleSchemas.roleResponseSchema },
        },
    }, roleController.createRole.bind(roleController));
    server.get('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 200: roleSchemas.roleResponseSchema },
        },
    }, roleController.getRole.bind(roleController));
    server.put('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            body: roleSchemas.updateRoleSchema,
            response: { 200: roleSchemas.roleResponseSchema },
        },
    }, roleController.updateRole.bind(roleController));
    server.delete('/:id', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 204: z.object({ success: z.boolean(), message: z.string() }) },
        },
    }, roleController.deleteRole.bind(roleController));
    server.get('/', {
        preHandler: [server.authenticate], // RBAC middleware will be added here later
        schema: {
            response: { 200: roleSchemas.rolesResponseSchema },
        },
    }, roleController.listRoles.bind(roleController));
}
