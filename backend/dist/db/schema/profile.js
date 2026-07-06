import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
export const profileTypeEnum = pgEnum('profile_type', ['line', 'service', 'dba', 'vlan']);
export const profiles = pgTable('profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    type: profileTypeEnum('type').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    nameTypeUnique: uniqueIndex('profiles_name_type_unique').on(table.name, table.type),
}));
