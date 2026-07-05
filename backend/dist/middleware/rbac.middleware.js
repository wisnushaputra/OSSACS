import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { db } from '../db';
import { roles } from '../db/schema';
import { eq } from 'drizzle-orm';
export async function rbacMiddleware(server) {
    server.decorate('authorize', (requiredPermissions) => async (request, reply) => {
        try {
            const userPayload = request.user; // Cast to UserPayload directly
            if (!userPayload || !userPayload.id || !userPayload.roleId) {
                throw new UnauthorizedError('Authentication required for authorization');
            }
            const userRole = await db.query.roles.findFirst({
                where: eq(roles.id, userPayload.roleId),
                with: {
                    permissions: {
                        with: {
                            permission: true, // Eager load the permission details
                        },
                    },
                },
            });
            if (!userRole) {
                throw new ForbiddenError('User role not found');
            }
            // Extract permission names from the loaded rolePermissions
            const userPermissions = userRole.permissions.map((rp) => rp.permission.name);
            const hasPermission = requiredPermissions.every((rp) => userPermissions.includes(rp));
            if (!hasPermission) {
                throw new ForbiddenError('Insufficient permissions');
            }
        }
        catch (err) {
            server.log.error(err);
            throw err; // Re-throw to be caught by global error handler
        }
    });
}
