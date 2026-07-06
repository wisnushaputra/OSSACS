import { z } from 'zod';

export const auditLogResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  action: z.string(),
  entity: z.string().nullable().optional(),
  entityId: z.string().uuid().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  createdAt: z.date(),
});

export const auditLogsResponseSchema = z.array(auditLogResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const auditLogSearchQuerySchema = paginationQuerySchema.extend({
  userId: z.string().uuid().optional(),
  entity: z.string().optional(), // Maps to "Modul"
  action: z.string().optional(),
  ipAddress: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const createAuditLogSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  action: z.string().min(1),
  entity: z.string().optional().nullable(),
  entityId: z.string().uuid().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const auditLogsPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: auditLogsResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export type AuditLogSearchQuery = z.infer<typeof auditLogSearchQuerySchema>;
export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;

export const auditLogSchemas = {
  auditLogResponseSchema,
  auditLogsResponseSchema,
  paginationQuerySchema,
  auditLogSearchQuerySchema,
  createAuditLogSchema,
  auditLogsPaginatedApiResponseSchema,
};
