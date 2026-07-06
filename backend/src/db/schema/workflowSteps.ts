import { pgTable, uuid, varchar, text, timestamp, index, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { workflows } from './workflows';

export const workflowStepStatusEnum = pgEnum('workflow_step_status', [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'SKIPPED',
]);

export const workflowSteps = pgTable(
  'workflow_steps',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workflowId: uuid('workflow_id')
      .references(() => workflows.id)
      .notNull(),
    stepName: varchar('step_name', { length: 255 }).notNull(),
    status: workflowStepStatusEnum('status').notNull().default('PENDING'),
    order: varchar('order', { length: 50 }).notNull(), // Assuming sequence like 1, 2, 3 or A, B, C
    inputData: jsonb('input_data'),
    outputData: jsonb('output_data'),
    error: text('error'),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      workflowIdIdx: index('workflow_steps_workflow_id_idx').on(table.workflowId),
      statusIdx: index('workflow_steps_status_idx').on(table.status),
    };
  },
);
