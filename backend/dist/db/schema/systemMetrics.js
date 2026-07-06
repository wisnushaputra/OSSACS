import { pgTable, uuid, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
export const metricNameEnum = pgEnum('metric_name', [
    'WORKFLOW_COUNT',
    'ACTIVE_DEVICE_COUNT',
    'ALARM_COUNT',
    'QUEUE_LENGTH',
    'API_RESPONSE_TIME',
]);
export const systemMetrics = pgTable('system_metrics', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: metricNameEnum('name').notNull(),
    value: integer('value').notNull(), // Assuming simple integer metrics for now. Adjust if float is needed.
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        nameIdx: index('system_metrics_name_idx').on(table.name),
        createdAtIdx: index('system_metrics_created_at_idx').on(table.createdAt),
    };
});
