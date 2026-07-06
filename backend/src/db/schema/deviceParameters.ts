import { pgTable, uuid, varchar, numeric, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { onus } from './onus';

export const deviceParameters = pgTable(
  'device_parameters',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
      .references(() => onus.id)
      .notNull(),
    rxPower: numeric('rx_power'),
    txPower: numeric('tx_power'),
    temperature: numeric('temperature'),
    voltage: numeric('voltage'),
    biasCurrent: numeric('bias_current'),
    wanStatus: varchar('wan_status', { length: 50 }),
    ipAddress: varchar('ip_address', { length: 45 }), // Supports IPv4 and IPv6
    firmwareVersion: varchar('firmware_version', { length: 255 }),
    uptime: integer('uptime'), // Uptime in seconds
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('device_parameters_onu_id_idx').on(table.onuId),
      createdAtIdx: index('device_parameters_created_at_idx').on(table.createdAt),
    };
  },
);