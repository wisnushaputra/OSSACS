import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { db } from '../db';
import { roles } from '../db/schema';
import { eq } from 'drizzle-orm';
export async function rbacMiddleware(server) {
    server.decorate('authorize', (requiredPermissions) => {
        return async (request, reply) => {
            try {
                const userPayload = request.user;
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
                const userPermissions = userRole.permissions.map((p) => p.name);
                const hasPermission = requiredPermissions.every(rp => userPermissions.includes(rp));
                if (!hasPermission) {
                    throw new ForbiddenError('Insufficient permissions');
                }
            }
            catch (err) {
                server.log.error(err);
                throw err; // Re-throw to be caught by global error handler
            }
        };
    });
}
