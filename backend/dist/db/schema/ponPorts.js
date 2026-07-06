import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { olts } from './olts';
export const ponPorts = pgTable('pon_ports', {
    id: uuid('id').defaultRandom().primaryKey(),
    oltId: uuid('olt_id')
        .references(() => olts.id)
        .notNull(),
    name: varchar('name', { length: 50 }).notNull(), // e.g., "PON 1", "0/0/1"
    portNumber: integer('port_number').notNull(),
    maxOnu: integer('max_onu').default(128).notNull(), // Common values 64, 128
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        oltIdIdx: index('pon_ports_olt_id_idx').on(table.oltId),
    };
});
