export class AuditLogService {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async searchAuditLogs(params) {
        return this.auditLogRepository.search(params);
    }
    async createAuditLog(data) {
        return this.auditLogRepository.create(data);
    }
}
