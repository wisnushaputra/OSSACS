import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import {
  permissionSchemas,
  CreatePermissionInput,
  UpdatePermissionInput,
} from './permission.schema';

export async function permissionRoutes(server: FastifyInstance) {
  const permissionRepository = new PermissionRepository();
  const permissionService = new PermissionService(permissionRepository);
  const permissionController = new PermissionController(permissionService);

  server.post<{
    Body: CreatePermissionInput;
    Reply: typeof permissionSchemas.permissionResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        body: permissionSchemas.createPermissionSchema,
        response: { 201: permissionSchemas.permissionResponseSchema },
      },
    },
    permissionController.createPermission.bind(permissionController),
  );

  server.get<{ Params: { id: string }; Reply: typeof permissionSchemas.permissionResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 200: permissionSchemas.permissionResponseSchema },
      },
    },
    permissionController.getPermission.bind(permissionController),
  );

  server.put<{
    Params: { id: string };
    Body: UpdatePermissionInput;
    Reply: typeof permissionSchemas.permissionResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        body: permissionSchemas.updatePermissionSchema,
        response: { 200: permissionSchemas.permissionResponseSchema },
      },
    },
    permissionController.updatePermission.bind(permissionController),
  );

  server.delete<{ Params: { id: string }; Reply: {} }>(
    '/:id',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 204: {} },
      },
    },
    permissionController.deletePermission.bind(permissionController),
  );

  server.get<{ Reply: typeof permissionSchemas.permissionsResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate], // RBAC middleware will be added here later
      schema: {
        response: { 200: permissionSchemas.permissionsResponseSchema },
      },
    },
    permissionController.listPermissions.bind(permissionController),
  );

  server.post<{ Body: { roleId: string; permissionId: string }; Reply: { message: string } }>(
    '/roles',
    {
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
    },
    permissionController.assignPermissionToRole.bind(permissionController),
  );

  server.delete<{ Body: { roleId: string; permissionId: string }; Reply: { message: string } }>(
    '/roles',
    {
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
    },
    permissionController.removePermissionFromRole.bind(permissionController),
  );
}
