import { FastifyInstance } from 'fastify';
import { AuditLogController } from './audit-logs.controller';
import { AuditLogRepository } from './audit-logs.repository';
import { AuditLogService } from './audit-logs.service';
import { auditLogSchemas } from './audit-logs.schema';
import { z } from 'zod';

export async function auditLogRoutes(server: FastifyInstance) {
  const auditLogRepository = new AuditLogRepository();
  const auditLogService = new AuditLogService(auditLogRepository);
  const auditLogController = new AuditLogController(auditLogService);

  // Search Audit Logs (GET /api/v1/audit-logs)
  server.get<{
    Querystring: z.infer<typeof auditLogSchemas.auditLogSearchQuerySchema>;
    Reply: typeof auditLogSchemas.auditLogsPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['audit_log:read'])],
      schema: {
        querystring: auditLogSchemas.auditLogSearchQuerySchema,
        response: { 200: auditLogSchemas.auditLogsPaginatedApiResponseSchema },
      },
    },
    auditLogController.searchAuditLogs.bind(auditLogController),
  );
}
