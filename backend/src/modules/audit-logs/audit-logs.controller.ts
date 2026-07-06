import { FastifyReply, FastifyRequest } from 'fastify';
import { AuditLogService } from './audit-logs.service';
import { auditLogSchemas } from './audit-logs.schema';
import { z } from 'zod';

export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  async searchAuditLogs(
    request: FastifyRequest<{ Querystring: z.infer<typeof auditLogSchemas.auditLogSearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const auditLogs = await this.auditLogService.searchAuditLogs(request.query);
    return reply.send({ success: true, data: auditLogs });
  }

  // creation is generally internal
}
