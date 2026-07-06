import { pgTable, uuid, varchar, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { onus } from './onus';
import { customers } from './customers';
import { olts } from './olts';

export const workflowStatusEnum = pgEnum('workflow_status', [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

export const workflows = pgTable(
  'workflows',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    status: workflowStatusEnum('status').notNull().default('PENDING'),
    triggeredBy: uuid('triggered_by').references(() => users.id),
    onuId: uuid('onu_id').references(() => onus.id),
    customerId: uuid('customer_id').references(() => customers.id),
    oltId: uuid('olt_id').references(() => olts.id),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('workflows_onu_id_idx').on(table.onuId),
      customerIdIdx: index('workflows_customer_id_idx').on(table.customerId),
      oltIdIdx: index('workflows_olt_id_idx').on(table.oltId),
      statusIdx: index('workflows_status_idx').on(table.status),
      createdAtIdx: index('workflows_started_at_idx').on(table.startedAt),
    };
  },
);
