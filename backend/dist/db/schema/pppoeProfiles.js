import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { onus } from './onus';
export const pppoeProfiles = pgTable('pppoe_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
        .references(() => onus.id)
        .notNull(),
    username: varchar('username', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    serviceVlan: integer('service_vlan'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
