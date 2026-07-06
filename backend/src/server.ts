import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
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
import { customerRoutes } from './modules/customer/customer.routes';
import { oltRoutes } from './modules/olt/olt.routes';
import { ponPortRoutes } from './modules/pon-port/pon-port.routes';
import { onuRoutes } from './modules/onu/onu.routes';
import { vendorRoutes } from './modules/vendor/vendor.routes';
import { profileRoutes } from './modules/profile/profile.routes';
import { regionRoutes } from './modules/region/region.routes';
import { popRoutes } from './modules/pop/pop.routes';
import { deviceStatusRoutes } from './modules/device-status/device-status.routes';
import { deviceParameterRoutes } from './modules/device-parameters/device-parameters.routes';
import { alarmRoutes } from './modules/alarms/alarms.routes';
import { eventRoutes } from './modules/events/events.routes';
import { workflowRoutes } from './modules/workflows/workflows.routes';
import { opticalHistoryRoutes } from './modules/optical-history/optical-history.routes';
import { notificationRoutes } from './modules/notifications/notifications.routes';
import { jobRoutes } from './modules/jobs/jobs.routes';
import { auditLogRoutes } from './modules/audit-logs/audit-logs.routes';
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { customerStatsRoutes } from "./modules/dashboard/customer-stats.routes";
import { onuStatsRoutes } from "./modules/dashboard/onu-stats.routes";
import { oltStatsRoutes } from "./modules/dashboard/olt-stats.routes";
import { alarmStatsRoutes } from "./modules/dashboard/alarm-stats.routes";
import { workflowStatsRoutes } from "./modules/dashboard/workflow-stats.routes";
import { systemMetricsRoutes } from "./modules/dashboard/system-metrics.routes";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from '@fastify/type-provider-zod';

export const createServer = (): FastifyInstance => {
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
  fastify.register(customerRoutes, { prefix: '/api/v1/customers' });
  fastify.register(oltRoutes, { prefix: '/api/v1/olts' });
  fastify.register(ponPortRoutes, { prefix: '/api/v1/pon-ports' });
  fastify.register(profileRoutes, { prefix: '/api/v1/profiles' });
  fastify.register(regionRoutes, { prefix: '/api/v1/regions' });
  fastify.register(popRoutes, { prefix: '/api/v1/pops' });
  fastify.register(onuRoutes, { prefix: '/api/v1/onus' });
  fastify.register(vendorRoutes, { prefix: '/api/v1/vendors' });
  fastify.register(deviceStatusRoutes, { prefix: '/api/v1/device-status' });
  fastify.register(deviceParameterRoutes, { prefix: '/api/v1/device-parameters' });
  fastify.register(alarmRoutes, { prefix: '/api/v1/alarms' });
  fastify.register(eventRoutes, { prefix: '/api/v1/events' });
  fastify.register(workflowRoutes, { prefix: '/api/v1/workflows' });
  fastify.register(opticalHistoryRoutes, { prefix: '/api/v1/optical-history' });
  fastify.register(systemMetricsRoutes, { prefix: "/api/v1/dashboard/system-metrics" });
  fastify.register(workflowStatsRoutes, { prefix: "/api/v1/dashboard/workflows" });
  fastify.register(alarmStatsRoutes, { prefix: "/api/v1/dashboard/alarms" });
  fastify.register(oltStatsRoutes, { prefix: "/api/v1/dashboard/olts" });
  fastify.register(onuStatsRoutes, { prefix: "/api/v1/dashboard/onus" });
  fastify.register(customerStatsRoutes, { prefix: "/api/v1/dashboard/customers" });
  fastify.register(dashboardRoutes, { prefix: "/api/v1/dashboard" });
  fastify.register(notificationRoutes, { prefix: '/api/v1/notifications' });
  fastify.register(auditLogRoutes, { prefix: '/api/v1/audit-logs' }); // Register audit logs route
  
  // Jobs API handles both GET history and POST manual add
  fastify.register(jobRoutes, { prefix: '/api/v1/jobs' });

  // Legacy fallback or raw endpoint if needed (usually handled in jobs.routes.ts now)
  fastify.post('/api/v1/jobs/raw', async (request, reply) => {
    const { jobName, data } = request.body as { jobName: string; data: any };
    await myQueue.add(jobName, data);
    return reply.status(202).send({ success: true, message: 'Job added to queue' });
  });

  return fastify;
};

export const startSocketIO = async (server: any, fastifyInstance: FastifyInstance) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: config.frontendUrl,
            methods: ["GET", "POST"]
        }
    });

    const pubClient = createClient({ url: config.redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));

    // Common Socket Authentication Middleware
    const socketAuthMiddleware = (socket: any, next: any) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }
        try {
            const decoded = fastifyInstance.jwt.verify(token);
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    };

    io.use(socketAuthMiddleware);

    // Setup Namespaces
    const namespaces = ['/dashboard', '/devices', '/workflow', '/notification', '/system', '/events'];
    
    namespaces.forEach(ns => {
        io.of(ns).use(socketAuthMiddleware).on("connection", (socket) => {
            logger.info(`Socket connected to ${ns}: ${socket.id} for user: ${socket.data.user?.id}`);
            
            // Auto-join user-specific room
            if (socket.data.user?.id) {
                socket.join(`user:${socket.data.user.id}`);
            }

            // Client can explicitly subscribe to rooms (e.g. region, pop, olt, customer)
            socket.on('subscribe', (room: string) => {
                // ponytail: missing explicit authz per-room, add when strict partitioning is needed
                socket.join(room);
                logger.info(`Socket ${socket.id} joined room: ${room}`);
            });

            socket.on('unsubscribe', (room: string) => {
                socket.leave(room);
                logger.info(`Socket ${socket.id} left room: ${room}`);
            });

            socket.on("disconnect", () => {
                logger.info(`Socket disconnected from ${ns}: ${socket.id}`);
            });
        });
    });

    // Event Bus Integration: Listen to Redis channels and broadcast via Socket.IO
    const eventBusSubscriber = pubClient.duplicate();
    eventBusSubscriber.connect().then(() => {
        const channels = ['dashboard', 'device', 'events', 'tasks', 'notification', 'system'];
        channels.forEach(channel => {
            eventBusSubscriber.subscribe(channel, (message) => {
                try {
                    const eventData = JSON.parse(message);
                    const ns = eventData.namespace || `/${channel === 'tasks' ? 'workflow' : channel}`;
                    const target = eventData.room ? io.of(ns).to(eventData.room) : io.of(ns);
                    target.emit(eventData.event, eventData);
                } catch (err) {
                    logger.error({ err }, `Error processing event from Redis channel ${channel}`);
                }
            });
        });
    }).catch(err => logger.error("Redis EventBus connect error", err));

    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id} for user: ${socket.data.user?.id}`);

        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};
