import { AuditLogController } from './audit-logs.controller';
import { AuditLogRepository } from './audit-logs.repository';
import { AuditLogService } from './audit-logs.service';
import { auditLogSchemas } from './audit-logs.schema';
export async function auditLogRoutes(server) {
    const auditLogRepository = new AuditLogRepository();
    const auditLogService = new AuditLogService(auditLogRepository);
    const auditLogController = new AuditLogController(auditLogService);
    // Search Audit Logs (GET /api/v1/audit-logs)
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['audit_log:read'])],
        schema: {
            querystring: auditLogSchemas.auditLogSearchQuerySchema,
            response: { 200: auditLogSchemas.auditLogsPaginatedApiResponseSchema },
        },
    }, auditLogController.searchAuditLogs.bind(auditLogController));
}
