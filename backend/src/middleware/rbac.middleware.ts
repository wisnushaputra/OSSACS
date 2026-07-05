import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { db } from '../db';
import { roles, permissions, rolePermissions } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { usersRelations, rolesRelations, permissionsRelations, rolePermissionsRelations } from '../db/relations';

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (requiredPermissions: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function rbacMiddleware(server: FastifyInstance) {
  server.decorate('authorize', (requiredPermissions: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userPayload = request.user as { id: string; username: string; roleId: string; iat: number; exp: number };

        if (!userPayload || !userPayload.id || !userPayload.roleId) {
          throw new UnauthorizedError('Authentication required for authorization');
        }

        const userRole = await db.query.roles.findFirst({
          where: eq(roles.id, userPayload.roleId),
          with: {
            permissions: true,
          },
        });

        if (!userRole) {
          throw new ForbiddenError('User role not found');
        }

        // Map the rolePermissions to get permission names
        // Since we're using relations, we need to access the permissions directly
        const userPermissions = (userRole as any).permissions.map((p: any) => p.name);

        const hasPermission = requiredPermissions.every(rp => userPermissions.includes(rp));

        if (!hasPermission) {
          throw new ForbiddenError('Insufficient permissions');
        }
      } catch (err) {
        server.log.error(err);
        throw err; // Re-throw to be caught by global error handler
      }
    };
  });
}