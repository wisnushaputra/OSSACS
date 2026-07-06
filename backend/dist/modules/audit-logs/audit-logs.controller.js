export class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    async searchAuditLogs(request, reply) {
        const auditLogs = await this.auditLogService.searchAuditLogs(request.query);
        return reply.send({ success: true, data: auditLogs });
    }
}
