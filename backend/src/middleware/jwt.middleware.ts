import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { UnauthorizedError } from '../lib/errors';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface UserPayload {
  id: string;
  username: string;
  roleId: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: UserPayload;
    user: UserPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function jwtMiddleware(server: FastifyInstance) {
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();

      const userPayload = request.user as UserPayload;

      // Optionally, fetch user from DB to ensure it's still active
      const user = await db.query.users.findFirst({
        where: eq(users.id, userPayload.id),
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User is inactive or not found');
      }
    } catch (err) {
      server.log.error(err);
      throw new UnauthorizedError('Invalid or expired token');
    }
  });
}
