import { pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { pops } from './pop';
export const olts = pgTable('olts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    vendor: varchar('vendor', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }),
    ipAddress: varchar('ip_address', { length: 45 }).notNull(), // Supports IPv4 and IPv6
    port: varchar('port', { length: 10 }).default('23'), // Telnet/SSH port
    username: varchar('username', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    transport: varchar('transport', { length: 20 }).default('telnet'), // telnet, ssh, snmp
    status: varchar('status', { length: 50 }).default('active').notNull(), // active, inactive, maintenance
    popId: uuid('pop_id').references(() => pops.id, { onDelete: 'restrict' }),
    location: varchar('location', { length: 255 }),
    description: text('description'),
    enabled: boolean('enabled').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    ipPortUnique: uniqueIndex('olts_ip_port_unique').on(table.ipAddress, table.port),
}));
