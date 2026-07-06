import { pgTable, uuid, varchar, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { onus } from './onus';

export const alarmTypeEnum = pgEnum('alarm_type', [
  'LOS',
  'DYING_GASP',
  'OPTICAL_LOW',
  'ONU_OFFLINE',
  'ONU_ONLINE',
  'POWER_FAILURE',
]);

export const alarmSeverityEnum = pgEnum('alarm_severity', [
  'CRITICAL',
  'MAJOR',
  'MINOR',
  'WARNING',
  'INFO',
]);

export const alarms = pgTable(
  'alarms',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    onuId: uuid('onu_id')
      .references(() => onus.id)
      .notNull(),
    type: alarmTypeEnum('type').notNull(),
    severity: alarmSeverityEnum('severity').notNull(),
    description: varchar('description', { length: 255 }), // Default nullable
    acknowledgedAt: timestamp('acknowledged_at'), // Default nullable
    resolvedAt: timestamp('resolved_at'), // Default nullable
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      onuIdIdx: index('alarms_onu_id_idx').on(table.onuId),
      typeIdx: index('alarms_type_idx').on(table.type),
      severityIdx: index('alarms_severity_idx').on(table.severity),
    };
  },
);
