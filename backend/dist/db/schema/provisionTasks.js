import { pgTable, uuid, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { onus } from './onus';
export const provisionTasks = pgTable('provision_tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
        .references(() => onus.id)
        .notNull(),
    taskType: varchar('task_type', { length: 50 }).notNull(), // REGISTER, PPPOE, REBOOT, FACTORY_RESET, REFRESH, WIFI, REPLACE
    status: varchar('status', { length: 50 }).default('WAITING').notNull(), // WAITING, RUNNING, SUCCESS, FAILED
    progress: integer('progress').default(0),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    finishedAt: timestamp('finished_at'),
    message: text('message'),
});
