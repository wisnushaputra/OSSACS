import { z } from 'zod';

export const deviceParameterResponseSchema = z.object({
  id: z.string().uuid(),
  onuId: z.string().uuid(),
  rxPower: z.string().nullable().optional(),
  txPower: z.string().nullable().optional(),
  temperature: z.string().nullable().optional(),
  voltage: z.string().nullable().optional(),
  biasCurrent: z.string().nullable().optional(),
  wanStatus: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  firmwareVersion: z.string().nullable().optional(),
  uptime: z.number().nullable().optional(),
  createdAt: z.date(),
});

export const deviceParametersResponseSchema = z.array(deviceParameterResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const deviceParametersPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: deviceParametersResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const deviceParameterApiResponseSchema = z.object({
  success: z.boolean(),
  data: deviceParameterResponseSchema,
});

export const deviceParameterHistoryQuerySchema = paginationQuerySchema.extend({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type DeviceParameterHistoryQuery = z.infer<typeof deviceParameterHistoryQuerySchema>;

export const deviceParameterSchemas = {
  deviceParameterResponseSchema,
  deviceParametersResponseSchema,
  paginationQuerySchema,
  deviceParametersPaginatedApiResponseSchema,
  deviceParameterApiResponseSchema,
  deviceParameterHistoryQuerySchema,
};