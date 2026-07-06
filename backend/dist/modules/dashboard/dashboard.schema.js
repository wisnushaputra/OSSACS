import { z } from 'zod';
export const dashboardFilterQuerySchema = z.object({
    regionId: z.string().uuid().optional(),
    popId: z.string().uuid().optional(),
    vendorId: z.string().uuid().optional(),
    oltId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
export const timeRangeQuerySchema = z.object({
    interval: z.enum(['24h', '7d', '30d', 'all']).default('24h').optional(),
});
export const dashboardSummaryResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        totalCustomers: z.number().int().min(0),
        totalOlts: z.number().int().min(0),
        totalOnus: z.number().int().min(0),
        onlineOnus: z.number().int().min(0),
        offlineOnus: z.number().int().min(0),
        losOnus: z.number().int().min(0),
        dyingGaspOnus: z.number().int().min(0),
        activeAlarms: z.number().int().min(0),
        runningWorkflows: z.number().int().min(0),
        oltHealthSummary: z.array(z.object({ status: z.string(), count: z.number() })).optional(),
        oltByVendor: z.array(z.object({ vendor: z.string(), count: z.number() })).optional(),
        ponPortUtilization: z.object({ totalPorts: z.number(), usedPorts: z.number() }).optional(),
        onuCapacityUsage: z.array(z.object({ oltName: z.string(), onuCount: z.number() })).optional(),
    }),
    permissions: z.object({
        canViewOltHealthSummary: z.boolean().optional(),
        canViewOltByVendor: z.boolean().optional(),
        canViewPonPortUtilization: z.boolean().optional(),
        canViewOnuCapacityUsage: z.boolean().optional(),
    }).optional()
});
export const dashboardSchemas = {
    dashboardSummaryResponseSchema,
    dashboardFilterQuerySchema,
    timeRangeQuerySchema,
};
