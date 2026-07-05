import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    level: varchar('level', { length: 50 }).default('INFO').notNull(), // INFO, WARNING, CRITICAL
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
