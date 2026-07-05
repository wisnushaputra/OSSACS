import { UnauthorizedError } from '../lib/errors';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
export async function jwtMiddleware(server) {
    server.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
            const userPayload = request.user;
            // Optionally, fetch user from DB to ensure it's still active
            const user = await db.query.users.findFirst({
                where: eq(users.id, userPayload.id),
            });
            if (!user || !user.isActive) {
                throw new UnauthorizedError('User is inactive or not found');
            }
        }
        catch (err) {
            server.log.error(err);
            throw new UnauthorizedError('Invalid or expired token');
        }
    });
}
