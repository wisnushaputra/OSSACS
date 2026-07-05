import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { onus } from './onus';
export const wifiProfiles = pgTable('wifi_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
        .references(() => onus.id)
        .notNull(),
    ssid: varchar('ssid', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    encryption: varchar('encryption', { length: 50 }),
    channel: integer('channel'),
    bandwidth: varchar('bandwidth', { length: 50 }),
    hidden: boolean('hidden').default(false),
    guestEnabled: boolean('guest_enabled').default(false),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
