import { z } from 'zod';

export const deviceStatusResponseSchema = z.object({
  id: z.string().uuid(),
  onuId: z.string().uuid(),
  status: z.enum(['ONLINE', 'OFFLINE', 'LOS', 'DYING_GASP', 'DISABLED', 'UNKNOWN']),
  rxPower: z.string().nullable().optional(),
  txPower: z.string().nullable().optional(),
  uptime: z.number().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  lastInform: z.date().nullable().optional(),
  lastContact: z.date().nullable().optional(),
  updatedAt: z.date(),
});

export const deviceStatusesResponseSchema = z.array(deviceStatusResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const deviceStatusesPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: deviceStatusesResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const deviceStatusApiResponseSchema = z.object({
  success: z.boolean(),
  data: deviceStatusResponseSchema,
});

export const deviceStatusSchemas = {
  deviceStatusResponseSchema,
  deviceStatusesResponseSchema,
  paginationQuerySchema,
  deviceStatusesPaginatedApiResponseSchema,
  deviceStatusApiResponseSchema,
};
