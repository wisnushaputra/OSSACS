import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { logger } from './lib/logger';
import { setupErrorHandler } from './middleware/errorHandler';
import { jwtMiddleware } from './middleware/jwt.middleware';
import { rbacMiddleware } from './middleware/rbac.middleware';
import { myQueue } from './lib/queue';
import { config } from './config';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/auth/user.routes';
import { roleRoutes } from './modules/auth/role.routes';
import { permissionRoutes } from './modules/auth/permission.routes';
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';

export const createServer = () => {
  const fastify = Fastify({
    loggerInstance: logger as any,
  }).withTypeProvider<ZodTypeProvider>();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Setup Global Error Handler
  setupErrorHandler(fastify);

  // Register JWT
  fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
  });

  // Register JWT Middleware for authentication
  jwtMiddleware(fastify);

  // Register RBAC/PBAC Middleware for authorization
  rbacMiddleware(fastify);



  fastify.get('/api/health', async () => {
    return { status: 'OK' };
  });

  // Register Auth Routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(userRoutes, { prefix: '/api/v1/users' });
  fastify.register(roleRoutes, { prefix: '/api/v1/roles' });
  fastify.register(permissionRoutes, { prefix: '/api/v1/permissions' });

  fastify.post('/api/v1/jobs', async (request, reply) => {
    const { jobName, data } = request.body as { jobName: string; data: any };
    await myQueue.add(jobName, data);
    return reply.status(202).send({ success: true, message: 'Job added to queue' });
  });

  return fastify;
};