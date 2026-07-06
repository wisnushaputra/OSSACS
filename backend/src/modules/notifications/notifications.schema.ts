import { z } from 'zod';

export const notificationResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  level: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  isRead: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const notificationsResponseSchema = z.array(notificationResponseSchema);

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const notificationSearchQuerySchema = paginationQuerySchema.extend({
  userId: z.string().uuid().optional(),
  level: z.enum(['INFO', 'WARNING', 'CRITICAL']).optional(),
  isRead: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const notificationsPaginatedApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: notificationsResponseSchema,
    total: z.number().int().min(0),
    limit: z.number().int().positive(),
    offset: z.number().int().min(0),
  }),
});

export const notificationApiResponseSchema = z.object({
  success: z.boolean(),
  data: notificationResponseSchema,
});

export const markAsReadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type NotificationSearchQuery = z.infer<typeof notificationSearchQuerySchema>;

export const notificationSchemas = {
  notificationResponseSchema,
  notificationsResponseSchema,
  paginationQuerySchema,
  notificationSearchQuerySchema,
  notificationsPaginatedApiResponseSchema,
  notificationApiResponseSchema,
  markAsReadResponseSchema,
};
