import { z } from 'zod';
const alarmTypeEnum = z.enum(['LOS', 'DYING_GASP', 'OPTICAL_LOW', 'ONU_OFFLINE', 'ONU_ONLINE', 'POWER_FAILURE']);
const alarmSeverityEnum = z.enum(['CRITICAL', 'MAJOR', 'MINOR', 'WARNING', 'INFO']);
export const alarmResponseSchema = z.object({
    id: z.string().uuid(),
    onuId: z.string().uuid(),
    type: alarmTypeEnum,
    severity: alarmSeverityEnum,
    description: z.string().nullable().optional(),
    acknowledgedAt: z.date().nullable().optional(),
    resolvedAt: z.date().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const alarmsResponseSchema = z.array(alarmResponseSchema);
export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    offset: z.coerce.number().int().min(0).default(0),
});
export const createAlarmSchema = z.object({
    onuId: z.string().uuid('Invalid ONU ID'),
    type: alarmTypeEnum,
    severity: alarmSeverityEnum,
    description: z.string().max(255).optional().nullable(),
});
export const updateAlarmSchema = z.object({
    type: alarmTypeEnum.optional(),
    severity: alarmSeverityEnum.optional(),
    description: z.string().max(255).optional().nullable(),
});
export const alarmSearchQuerySchema = paginationQuerySchema.extend({
    onuId: z.string().uuid().optional(),
    type: alarmTypeEnum.optional(),
    severity: alarmSeverityEnum.optional(),
    isResolved: z
        .union([z.literal('true'), z.literal('false')])
        .transform((val) => val === 'true')
        .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
export const alarmsPaginatedApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        data: alarmsResponseSchema,
        total: z.number().int().min(0),
        limit: z.number().int().positive(),
        offset: z.number().int().min(0),
    }),
});
export const alarmApiResponseSchema = z.object({
    success: z.boolean(),
    data: alarmResponseSchema,
});
export const alarmSchemas = {
    alarmResponseSchema,
    alarmsResponseSchema,
    paginationQuerySchema,
    createAlarmSchema,
    updateAlarmSchema,
    alarmSearchQuerySchema,
    alarmsPaginatedApiResponseSchema,
    alarmApiResponseSchema,
};
