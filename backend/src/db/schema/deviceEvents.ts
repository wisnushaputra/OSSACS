import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { onus } from './onus';

export const deviceEvents = pgTable(
  'device_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
      .references(() => onus.id)
      .notNull(),
    eventType: varchar('event_type', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('device_events_onu_id_idx').on(table.onuId),
      eventTypeIdx: index('device_events_event_type_idx').on(table.eventType),
      createdAtIdx: index('device_events_created_at_idx').on(table.createdAt),
    };
  },
);
