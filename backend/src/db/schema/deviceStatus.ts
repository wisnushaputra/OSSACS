import { pgTable, uuid, varchar, numeric, bigint, timestamp, index } from 'drizzle-orm/pg-core';
import { onus } from './onus';

export const deviceStatus = pgTable(
  'device_status',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
      .references(() => onus.id)
      .notNull(),
    status: varchar('status', { length: 50 }).notNull(), // ONLINE, OFFLINE, LOS, DYING_GASP, UNKNOWN
    rxPower: numeric('rx_power'),
    txPower: numeric('tx_power'),
    uptime: bigint('uptime', { mode: 'number' }),
    ipAddress: varchar('ip_address', { length: 45 }), // Supports IPv4 and IPv6
    lastInform: timestamp('last_inform'),
    lastContact: timestamp('last_contact'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('device_status_onu_id_idx').on(table.onuId),
      statusIdx: index('device_status_status_idx').on(table.status),
    };
  },
);
