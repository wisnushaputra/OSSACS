import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { customers } from './customers';
import { olts } from './olts';

export const onus = pgTable(
  'onus',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id')
      .references(() => customers.id)
      .notNull(),
    oltId: uuid('olt_id')
      .references(() => olts.id)
      .notNull(),
    serialNumber: varchar('serial_number', { length: 255 }).notNull().unique(),
    genieDeviceId: varchar('genie_device_id', { length: 255 }).notNull().unique(),
    ponPort: varchar('pon_port', { length: 255 }).notNull(),
    onuId: integer('onu_id').notNull(),
    profileName: varchar('profile_name', { length: 255 }).notNull(),
    vlan: integer('vlan').notNull(),
    firmware: varchar('firmware', { length: 255 }),
    model: varchar('model', { length: 255 }),
    manufacturer: varchar('manufacturer', { length: 255 }),
    deletedAt: timestamp('deleted_at'),
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      serialNumberIdx: index('serial_number_idx').on(table.serialNumber),
      genieDeviceIdIdx: index('genie_device_id_idx').on(table.genieDeviceId),
      oltIdIdx: index('olt_id_idx').on(table.oltId),
      customerIdIdx: index('customer_id_idx').on(table.customerId),
    };
  },
);
