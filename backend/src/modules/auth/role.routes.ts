import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { roleSchemas, CreateRoleInput, UpdateRoleInput } from './role.schema';

export async function roleRoutes(server: FastifyInstance) {
  const roleRepository = new RoleRepository();
  const roleService = new RoleService(roleRepository);
  const roleController = new RoleController(roleService);

  server.post<{ Body: CreateRoleInput; Reply: typeof roleSchemas.roleResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        body: roleSchemas.createRoleSchema,
        response: { 201: roleSchemas.roleResponseSchema },
      },
    },
    roleController.createRole.bind(roleController),
  );

  server.get<{ Params: { id: string }; Reply: typeof roleSchemas.roleResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 200: roleSchemas.roleResponseSchema },
      },
    },
    roleController.getRole.bind(roleController),
  );

  server.put<{
    Params: { id: string };
    Body: UpdateRoleInput;
    Reply: typeof roleSchemas.roleResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        body: roleSchemas.updateRoleSchema,
        response: { 200: roleSchemas.roleResponseSchema },
      },
    },
    roleController.updateRole.bind(roleController),
  );

  server.delete<{ Params: { id: string }; Reply: { success: boolean; message: string } }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 204: z.object({ success: z.boolean(), message: z.string() }) },
      },
    },
    roleController.deleteRole.bind(roleController),
  );

  server.get<{ Reply: typeof roleSchemas.rolesResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 200: roleSchemas.rolesResponseSchema },
      },
    },
    roleController.listRoles.bind(roleController),
  );
}
