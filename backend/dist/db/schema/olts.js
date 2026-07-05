import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
export const olts = pgTable('olts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    vendor: varchar('vendor', { length: 255 }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }).notNull(), // Supports IPv4 and IPv6
    location: varchar('location', { length: 255 }),
    description: text('description'),
    enabled: boolean('enabled').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
