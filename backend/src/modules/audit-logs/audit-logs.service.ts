import { AuditLogRepository } from './audit-logs.repository';
import { AuditLogSearchQuery, CreateAuditLogInput } from './audit-logs.schema';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async searchAuditLogs(params: AuditLogSearchQuery) {
    return this.auditLogRepository.search(params);
  }

  async createAuditLog(data: CreateAuditLogInput) {
    return this.auditLogRepository.create(data);
  }
}
