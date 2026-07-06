import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum, jsonb } from 'drizzle-orm/pg-core';
export const jobStatusEnum = pgEnum('job_status', [
    'PENDING',
    'ACTIVE',
    'COMPLETED',
    'FAILED',
    'DELAYED',
    'RETRYING'
]);
export const jobs = pgTable('jobs', {
    id: uuid('id').defaultRandom().primaryKey(),
    jobName: varchar('job_name', { length: 255 }).notNull(),
    status: jobStatusEnum('status').notNull().default('PENDING'),
    data: jsonb('data'),
    result: jsonb('result'),
    error: text('error'),
    attempts: integer('attempts').default(0).notNull(),
    startedAt: timestamp('started_at'),
    finishedAt: timestamp('finished_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        jobNameIdx: index('jobs_job_name_idx').on(table.jobName),
        statusIdx: index('jobs_status_idx').on(table.status),
        createdAtIdx: index('jobs_created_at_idx').on(table.createdAt),
    };
});
