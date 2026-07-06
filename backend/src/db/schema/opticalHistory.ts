import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { onus } from './onus';

export const opticalHistory = pgTable(
  'optical_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
      .references(() => onus.id)
      .notNull(),
    rxPower: numeric('rx_power'),
    txPower: numeric('tx_power'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('optical_history_onu_id_idx').on(table.onuId),
      createdAtIdx: index('optical_history_created_at_idx').on(table.createdAt),
    };
  },
);
