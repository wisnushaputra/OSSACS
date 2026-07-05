import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id), // User could be null for system actions
    action: varchar('action', { length: 255 }).notNull(), // LOGIN, CREATE_USER, REGISTER_ONU, etc.
    entity: varchar('entity', { length: 255 }), // e.g., 'ONU', 'User', 'OLT'
    entityId: uuid('entity_id'), // ID of the entity affected
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdx: index('audit_logs_user_id_idx').on(table.userId),
      createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
    };
  },
);
