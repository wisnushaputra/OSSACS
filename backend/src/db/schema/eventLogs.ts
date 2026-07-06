import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { customers } from './customers';
import { onus } from './onus';
import { olts } from './olts';

export const eventLogs = pgTable(
  'event_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventType: varchar('event_type', { length: 255 }).notNull(),
    description: text('description'),
    customerId: uuid('customer_id').references(() => customers.id),
    onuId: uuid('onu_id').references(() => onus.id),
    oltId: uuid('olt_id').references(() => olts.id),
    workflowId: uuid('workflow_id'), // Will reference workflows.id once Epic 5 is done
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      eventTypeIdx: index('event_logs_event_type_idx').on(table.eventType),
      customerIdIdx: index('event_logs_customer_id_idx').on(table.customerId),
      onuIdIdx: index('event_logs_onu_id_idx').on(table.onuId),
      oltIdIdx: index('event_logs_olt_id_idx').on(table.oltId),
      workflowIdIdx: index('event_logs_workflow_id_idx').on(table.workflowId),
      createdAtIdx: index('event_logs_created_at_idx').on(table.createdAt),
    };
  },
);
